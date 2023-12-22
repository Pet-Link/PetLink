# CS353 Term Project - Fall 2023

## Petlink (Pet Adoption and Care System)

### Group 3 Members

- Ahmet Alperen Yılmazyıldız - 22002712
- Zeynep Doğa Dellal - 22002572
- Borga Haktan Bilen - 22002733
- Kardelen Ceren - 22003017
- Yusuf Şenyüz - 21903105

## Functionalities

- **Common Features:**

  - All user types (Adopters, Administrators, Veterinarians, Shelters) can register, log in, and recover passwords via verification codes.

- **Adopters:**

  - Search and filter adoptable pets
  - Create adoption applications
  - Schedule meet and greet sessions with unadopted pets
  - Add their own pets
  - Search and filter for veterinarians
  - Book veterinarian appointments for their pets
  - Engage in forums by writing posts and replies
  - View various pet care information
  - Access their pets' medical records
  - Top-up account balance

- **Administrators:**

  - Search and filter for all pets added by shelters
  - Manage unadopted pets' listings and
  - View and approve or decline adoption applications
  - View system reports
  - Create pet care information posts
  - Participate in forums

- **Veterinarians:**

  - Manage appointments (approve, decline, reschedule)
  - Log medical records
  - Participate in the forum. Their replies are highlighted as an expert answer

- **Shelters:**
  - List pets for adoption
  - Search and filter for the pets in their shelter
  - Manage their pet listings
  - Participate in forums

## Execution Instructions

**Backend Setup:**

```bash
cd backend
docker-compose up
```

**Frontend Setup:**

```bash
cd frontend
npm install
npm run start
```
