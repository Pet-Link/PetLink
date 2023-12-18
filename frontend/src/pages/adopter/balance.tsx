import React, { useState } from 'react';
import { TextField, Button, InputAdornment, Typography, Grid } from '@mui/material';
import AttachMoney from '@mui/icons-material/AttachMoney';

const Balance = () => {
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
        // Handle pay button click logic here
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
                label="Expire Date"
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
