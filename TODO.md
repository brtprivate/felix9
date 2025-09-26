# Admin Page Implementation

## Tasks
- [x] Create src/pages/Admin.tsx with owner check and UI for owner functions
- [x] Update src/App.tsx to add /admin route
- [x] Add Admin link to Navbar for owner accounts
- [ ] Test the admin page functionality

## Details
- Admin page should check if connected account is owner
- Display current contract values (owner, direct income, ROI percents, balance)
- Provide forms for:
  - Add Liquidity (amount input)
  - Change Direct Income (percentage input)
  - Transfer Ownership (address input)
  - Update ROI Percent (package index select + percent input)
- Use MUI components for consistent styling
- Handle loading states and errors
