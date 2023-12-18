import React, { useState } from 'react';
import { TextField, Button, InputAdornment, Typography, Grid } from '@mui/material';
import AttachMoney from '@mui/icons-material/AttachMoney';
import toastr from "toastr";
import {AdopterService} from "../../services/adopterService";
import {useNavigate} from "react-router-dom";

const Balance = () => {
    const navigate = useNavigate();
    const [nameOnCard, setNameOnCard] = useState('');
    const [creditCardNumber, setCreditCardNumber] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [topUpAmount, setTopUpAmount] = useState('');

    const handleNameOnCardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameOnCard(event.target.value);
    };

    const handleCreditCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreditCardNumber(event.target.value);
    };

    const handleExpireDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExpireDate(event.target.value);
    };

    const handleCvvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCvv(event.target.value);
    };

    const handleTopUpAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTopUpAmount(event.target.value);
    };

    const handlePayButtonClick = () => {
        // Validate inputs before proceeding
        if (!nameOnCard.trim()) {
            toastr.error('Please enter the name on the card.');
            return;
        }

        if (!creditCardNumber.trim() || creditCardNumber.length !== 16 || !/^\d+$/.test(creditCardNumber)) {
            toastr.error('Invalid card number. It should be 16 digits.');
            return;
        }

        if (!expireDate.trim() || !/^\d{2}\/\d{2}$/.test(expireDate)) {
            toastr.error('Invalid expiration date. Use MM/YY format.');
            return;
        }

        // Check if expiration date is not in the past
        const [monthStr, yearStr] = expireDate.split('/');
        const expMonth = parseInt(monthStr, 10);
        const expYear = parseInt(yearStr, 10);
        const expDate = new Date(expYear + 2000, expMonth - 1);
        const currentDate = new Date();

        if (isNaN(expMonth) || expMonth < 1 || expMonth > 12) {
            toastr.error('Invalid expiration month. It should be between 01 and 12.');
            return;
        }

        if (expDate < currentDate) {
            toastr.error('Your card has expired.');
            return;
        }

        if (!cvv.trim() || cvv.length < 3 || cvv.length > 4 || !/^\d+$/.test(cvv)) {
            toastr.error('Invalid CVV. It should be 3 or 4 digits.');
            return;
        }

        const numericTopUpAmount = parseFloat(topUpAmount);
        if (!topUpAmount.trim() || isNaN(numericTopUpAmount) || numericTopUpAmount <= 0) {
            toastr.error('Please enter a valid top-up amount.');
            return;
        }
        AdopterService.addBalance(topUpAmount).then(
            function(result) {
                if (result.ok) {
                    result.text().then((text) => {
                        try {
                            toastr.success('Balance is updated.');
                            navigate(`/${localStorage.getItem('user_role')}/home`);
                        } catch (error) {
                            console.error('Invalid JSON:', text);
                        }
                    });
                } else {
                    console.log(result);
                    result.text().then((text) => {
                        try {
                            toastr.error("An internal error occurred while updating balance.");
                        } catch (error) {
                            console.error('Invalid JSON:', text);
                        }
                    });
                }
            }
        );
    };

    return (
        <Grid sx={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 20, 
            mb: 5
        }}>
            <Typography sx={{mb:5}} variant="h4">Add Balance</Typography>
            <TextField sx={{mb:2, width: '20vw'}} 
                label="Name on Card"
                value={nameOnCard}
                onChange={handleNameOnCardChange}
            />
            <TextField sx={{mb:2, width: '20vw'}} 
                label="Credit Card Number"
                value={creditCardNumber}
                onChange={handleCreditCardNumberChange}
            />
            <TextField sx={{mb:2, width: '20vw'}} 
                label="Expire Date (MM/YY)"
                value={expireDate}
                onChange={handleExpireDateChange}
            />
            <TextField sx={{mb:2, width: '20vw'}}
                label="CVV"
                value={cvv}
                onChange={handleCvvChange}
            />
            <TextField sx={{mb:2, width: '20vw'}}
                label="Top-up Amount"
                value={topUpAmount}
                onChange={handleTopUpAmountChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <AttachMoney />
                        </InputAdornment>
                    ),
                }}
            />
            <Button variant="contained" color="success" onClick={handlePayButtonClick} sx={{width: '15vw'}}>
                Pay
            </Button>
        </Grid>
    );
};

export default Balance;
