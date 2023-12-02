import re  
import os
from flask import Flask, render_template, request, redirect, url_for, session
import mysql.connector

app = Flask(__name__) 

app.secret_key = 'abcdefgh'

connection = mysql.connector.connect(host='db',
                                         database='cs353hw4db',
                                         user='root',
                                         password='password')


# NOTE: I have a trigger in the database (can be seen in schema.sql) that automatically updates the quota of the company when a 
# student applies to it or cancels their application.
# Thus, the initial quota of the companies are also updated with the initial applications of the students that is given in the prompt.
# Because of that, all the companies have 1 less quota than the initial quota given in the prompt.
# For instance, Amazon has 0 quota left in the database, but it has 1 quota left in the prompt.
# 
# There are no indications in the prompt that I shouldn't update the quota of the companies with the initial applications of the students.
# Thus, this is my own interpretation and its not an error or bug.

@app.route('/')

@app.route('/login', methods =['GET', 'POST'])
def login():
    message = ''
    if request.method == 'POST' and 'sname' in request.form and 'sid' in request.form:
        sname = request.form['sname']
        sid = request.form['sid']
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM student WHERE sname = %s AND sid = %s', (sname, sid))
        user = cursor.fetchone()
        if user:              
            session['loggedin'] = True
            session['userid'] = user[0]
            session['username'] = user[1]
            message = 'Logged in successfully!'
            return redirect(url_for('mainpage'))
        else:
            message = 'Please enter correct student name and student ID !'
    return render_template('login.html', message = message)

@app.route('/logout', methods =['POST'])
def logout():
    message = ''
    if request.method == 'POST':
        session.pop('loggedin', None)
        session.pop('userid', None)
        session.pop('username', None)
        message = 'Logged out successfully!'
        return render_template('login.html', message = message)

@app.route('/register', methods =['GET', 'POST'])
def register():
    message = ''
    if request.method == 'POST' and 'sname' in request.form and 'sid' in request.form and 'bdate' in request.form and 'dept' in request.form and 'year' in request.form and 'gpa' in request.form:
        sname = request.form['sname']
        sid = request.form['sid']
        bdate = request.form['bdate']
        dept = request.form['dept']
        dept = dept.upper()
        year = request.form['year']
        year = year.lower()
        gpa = request.form['gpa']
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM student WHERE sname = %s and sid = %s', (sname, sid))
        account = cursor.fetchone()

        if not re.match(r'[S][0-9]{1,5}', sid):
            message = 'SID must be in the format of SDigitDigitDigitDigitDigit!'
        # check if the year is valid
        elif year not in ['junior', 'senior', 'sophomore', 'freshman']:
            #message = 'Please enter a valid school year (junior, freshman, senior, sophomore)!'
            message = year
        # check if the student exists in the database
        elif account:
            message = 'Choose a different student name and sid!'
        # check if all the fields are filled
        elif not sname or not sid or not bdate or not dept or not year or not gpa :
            message = 'Please fill out the form!'
        # check if the gpa is in floating point format
        elif not re.match(r'[0-9]{1}[.][0-9]{1,2}', gpa):
            message = 'Please enter a valid GPA!'
        else:
            cursor.execute('INSERT INTO student (sid, sname, bdate, dept, year, gpa) VALUES (%s, %s, %s, %s, %s, %s)', (sid, sname, bdate, dept, year, gpa,))
            connection.commit()
            message = 'User successfully created!'

    elif request.method == 'POST':

        message = 'Please fill all the fields!'
    return render_template('register.html', message = message)

@app.route('/mainpage', methods=['GET', 'POST'])
def mainpage():
    message = ''
    if request.method == 'GET' and 'loggedin' in session and session['loggedin'] == True:
        # get the application of students from the database as a table
        cursor = connection.cursor()
        userID = session['userid']
        cursor.execute('SELECT * FROM apply natural join student natural join company WHERE sid = %s', (userID,))
        applications = cursor.fetchall()
        message = 'Welcome ' + session['username'] + '!'
        return render_template('mainpage.html', message=message, applications=applications)

    else:
        message = 'Please login first!'
        return render_template('login.html', message=message)
    
@app.route('/cancel_apply/<cid>', methods=['POST'])
def cancel_apply(cid):
    message = ''
    if request.method == 'POST' and 'loggedin' in session and session['loggedin'] == True:
        # get the application of students from the database as a table and update the database
        cursor = connection.cursor()
        userID = session['userid']
        cursor.execute('DELETE FROM apply WHERE sid = %s and cid = %s', (userID, cid,))
        connection.commit()
        cursor.execute('SELECT * FROM apply natural join student natural join company WHERE sid = %s', (userID,))
        message = 'Cancelled your application to company ' + cid + '!'
        applications = cursor.fetchall()
        return render_template('mainpage.html', message=message, applications=applications)

    else:
        message = 'Please login first!'
        return render_template('login.html', message=message)

@app.route('/apply_new', methods=['GET'])
def apply_new():
    message = ''
    if request.method == 'GET' and 'loggedin' in session and session['loggedin'] == True:
        # get the application of students from the database as a table
        cursor = connection.cursor()
        userID = session['userid']
        cursor.execute('SELECT * FROM apply natural join student natural join company WHERE sid = %s', (userID,))
        applications = cursor.fetchall()

        if len(applications) == 3:
            message = 'You already have 3 applications!'
            return render_template('mainpage.html', message=message, applications=applications)
        
        cursor.execute('SELECT * FROM student WHERE sid = %s', (userID,))
        student = cursor.fetchone()
        gpa = student[5]
        cursor.execute('SELECT * FROM company where cid not in (SELECT cid FROM apply WHERE sid = %s) and gpa_threshold <= %s and quota > 0', (userID, gpa,))
        candidateComp = cursor.fetchall()
        return render_template('applynew.html', message=message, candidateComp=candidateComp)

    else:
        message = 'Please login first!'
        return render_template('login.html', message=message)

@app.route('/apply_submit', methods=['POST'])
def apply_submit():
    message = ''
    if request.method == 'POST' and 'loggedin' in session and session['loggedin'] == True and 'a_cid' in request.form:
        apply_cid = request.form['a_cid']
        userID = session['userid']
        cursor = connection.cursor()
        # get the student
        cursor.execute('SELECT * FROM student WHERE sid = %s', (userID,))
        student = cursor.fetchone()
        gpa = student[5]
        cursor.execute('SELECT * FROM company WHERE cid = %s and gpa_threshold <= %s and quota > 0', (apply_cid, gpa))
        company = cursor.fetchone()

        if not company:
            message = 'Please enter a valid company ID!'
            cursor.execute('SELECT * FROM company where cid not in (SELECT cid FROM apply WHERE sid = %s) and gpa_threshold <= %s and quota > 0', (userID, gpa,))
            candidateComp = cursor.fetchall()
            return render_template('applynew.html', message=message, candidateComp=candidateComp)
        
        # check if the student is already applied to the company
        cursor.execute('SELECT * FROM apply WHERE sid = %s and cid = %s', (userID, apply_cid,))
        alreadyApplied = cursor.fetchone()

        if alreadyApplied:
            message = 'You already applied to this company!'
            cursor.execute('SELECT * FROM company where cid not in (SELECT cid FROM apply WHERE sid = %s) and gpa_threshold <= %s and quota > 0', (userID, gpa,))
            candidateComp = cursor.fetchall()
            return render_template('applynew.html', message=message, candidateComp=candidateComp)
        
        # check if the student has 3 applications
        cursor.execute('SELECT count(*) as cnt FROM apply natural join student natural join company WHERE sid = %s', (userID,))
        countofapply = cursor.fetchall()
        if countofapply[0][0] == 3:
            message = 'You already have 3 applications!'
            cursor.execute('SELECT * FROM company where cid not in (SELECT cid FROM apply WHERE sid = %s) and gpa_threshold <= %s and quota > 0', (userID, gpa,))
            candidateComp = cursor.fetchall()
            return render_template('applynew.html', message=message, candidateComp=candidateComp)


        # insert the application
        cursor.execute('INSERT INTO apply (sid, cid) VALUES (%s, %s)', (userID, apply_cid,))
        connection.commit()
        cursor.execute('SELECT * FROM company where cid not in (SELECT cid FROM apply WHERE sid = %s) and gpa_threshold <= %s and quota > 0', (userID, gpa,))
        candidateComp = cursor.fetchall()
        message = f'You have successfully applied to company with cid {apply_cid}!'
        return render_template('applynew.html', message=message, candidateComp=candidateComp)

    else:
        message = 'Please login first!'
        return render_template('login.html', message=message)

@app.route('/analysis', methods =['GET', 'POST'])
def analysis():
    message = ''
    if request.method == 'GET' and 'loggedin' in session and session['loggedin'] == True:
        cursor = connection.cursor()
        userID = session['userid']
        # get the application of the student from the database as a table ordered by quota descending
        cursor.execute('SELECT cname, quota, gpa_threshold FROM apply natural join student natural join company WHERE sid = %s ORDER BY quota DESC', (userID,))
        applications = cursor.fetchall()
        # minmax quota query
        cursor.execute('SELECT min(gpa_threshold) as min_gpa_threshold, max(gpa_threshold) as max_gpa_threshold FROM apply natural join student natural join company WHERE sid = %s', (userID,))
        minmaxgpa = cursor.fetchall()
        # get the application of the student from the database as a table grouped by city
        cursor.execute('SELECT city, count(*) as application_count from apply natural join company where sid = %s group by city', (userID,))
        city_count = cursor.fetchall()
        # get the company names with max and min quota
        cursor.execute('SELECT MAXQ.cname AS company_with_max_quota, MINQ.cname AS company_with_min_quota FROM (SELECT cname FROM apply natural join company WHERE quota = (SELECT MAX(quota) FROM apply natural join company WHERE  sid = %s) AND sid=%s) AS MAXQ JOIN (SELECT cname FROM apply natural join company WHERE quota = (SELECT MIN(quota) FROM apply natural join company WHERE  sid = %s) AND  sid = %s) AS MINQ', (userID, userID, userID, userID,))
        minmaxquota = cursor.fetchall()
        return render_template('analysis.html', message=message, applications=applications, minmaxgpa=minmaxgpa, city_count=city_count, minmaxquota=minmaxquota)

    else:
        message = 'Please login first!'
        return render_template('login.html', message=message)

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
