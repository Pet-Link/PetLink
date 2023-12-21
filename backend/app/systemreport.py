from flask import Blueprint, Response, request, jsonify
from database import get_connection

systemreport = Blueprint('systemreport', __name__, url_prefix='/systemreport')

# Get top veterinarians by appointment number - GET
@systemreport.route('/top-veterinarians', methods=['GET'])
def top_veterinarians():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        query = """
        SELECT
            v.user_ID, u.name, v.speciality,
            v.year_of_experience, a.appointment_count
        FROM
            Veterinarian v
        JOIN
            User u ON v.user_ID = u.user_ID
        LEFT JOIN
            (SELECT
                veterinarian_ID,
                COUNT(*) AS appointment_count
            FROM
                Appointment
            GROUP BY
                veterinarian_ID) a ON v.user_ID = a.veterinarian_ID
        ORDER BY
            a.appointment_count DESC,
            v.year_of_experience DESC
        LIMIT 10;
        """
        cursor.execute(query)
        results = cursor.fetchall()
        
        # Convert result set to list of dictionaries
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in results]
        
        return jsonify(results)
    except Exception as e:
        return Response(f'Failed to create a system report for top veterinarians\n{e}', status=500)

# Get total (adopted), min and max adoption fees with their pets - GET 
@systemreport.route('/adoption-fees-summary', methods=['GET'])
def adoption_fees_summary():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        query = """
        WITH MinMaxFees AS (
            SELECT
                MAX(adoption_fee) AS MaxFee,
                MIN(adoption_fee) AS MinFee
            FROM Pet
        ),
        MaxFeePet AS (
            SELECT
                p.name AS max_fee_pet_name,
                u.name AS max_fee_shelter_name,
                p.adoption_fee AS max_fee
            FROM
                Pet p
                JOIN User u ON p.shelter_ID = u.user_ID
            WHERE
                p.adoption_fee = (SELECT MaxFee FROM MinMaxFees)
            LIMIT 1
        ),
        MinFeePet AS (
            SELECT
                p.name AS min_fee_pet_name,
                u.name AS min_fee_shelter_name,
                p.adoption_fee AS min_fee
            FROM
                Pet p
                JOIN User u ON p.shelter_ID = u.user_ID
            WHERE
                p.adoption_fee = (SELECT MinFee FROM MinMaxFees)
            LIMIT 1
        )
        SELECT
            MAX(mfp.max_fee_pet_name) AS max_fee_pet_name,
            MAX(mfp.max_fee_shelter_name) AS max_fee_shelter_name,
            MAX(mfp.max_fee) AS max_fee,
            MAX(mnp.min_fee_pet_name) AS min_fee_pet_name,
            MAX(mnp.min_fee_shelter_name) AS min_fee_shelter_name,
            MAX(mnp.min_fee) AS min_fee,
            COALESCE((SELECT SUM(adoption_fee) FROM Pet WHERE adoption_status = TRUE), 0) AS total_adoption_fee
        FROM
            MaxFeePet mfp,
            MinFeePet mnp;
        """
        cursor.execute(query)
        results = cursor.fetchall()
        
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in results]
        
        return jsonify(results)
    except Exception as e:
        return Response(f'Failed to fetch adoption fees summary\n{e}', status=500)

# Get the adopters with the most number of adoptions - GET 
@systemreport.route('/top-adopters', methods=['GET'])
def top_adopters():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        query = """
        SELECT
            u.user_ID,
            u.name,
            COUNT(p.pet_ID) AS adoption_count
        FROM
            User u
            JOIN Pet p ON u.user_ID = p.adopter_ID
        WHERE
            p.adoption_status = TRUE
        GROUP BY
            u.user_ID, u.name
        ORDER BY
            adoption_count DESC
        LIMIT 10;
        """
        cursor.execute(query)
        results = cursor.fetchall()
        
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in results]
        
        return jsonify(results)
    except Exception as e:
        return Response(f'Failed to fetch top adopters\n{e}', status=500)

# Get breeds that were the most adopted - GET 
@systemreport.route('/top-adopted-breeds', methods=['GET'])
def top_adopted_breeds():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        query = """
        SELECT
            p.breed,
            COUNT(p.pet_ID) AS adoption_count
        FROM
            Pet p
        WHERE
            p.adoption_status = TRUE
        GROUP BY
            p.breed
        ORDER BY
            adoption_count DESC
        LIMIT 10;
        """
        cursor.execute(query)
        results = cursor.fetchall()
        
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in results]
        
        return jsonify(results)
    except Exception as e:
        return Response(f'Failed to fetch top adopted breeds\n{e}', status=500)