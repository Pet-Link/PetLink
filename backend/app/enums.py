from enum import Enum

# create an enum for verification status
class VerificationStatus(Enum):
    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'
