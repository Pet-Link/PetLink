import React from 'react';
type overseeRecordModel = {
    record_ID: number;
    administrator_ID: number;
    adopter_ID: number;
    date: Date;
    details: string;
    verification_status: boolean | null;
};

export default overseeRecordModel;