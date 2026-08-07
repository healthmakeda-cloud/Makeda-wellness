// A curated, categorized list of common UK medicines — organized for browsing
// and interaction-awareness, not a full NHS dm+d database dump (that dataset
// is built for typeahead search across 100,000+ entries, not for tick-box
// browsing). Categories loosely mirror the health history sections already
// in the intake form, since that's what matters for spotting interactions.
//
// This lists medicine NAMES only — no dosing, interaction, or clinical
// guidance text, which stays inside the licensed BNF and isn't reproduced here.

export const medicineCategories = [
  {
    category: 'Pain relief & anti-inflammatory',
    items: ['Paracetamol', 'Ibuprofen', 'Aspirin', 'Naproxen', 'Codeine', 'Tramadol', 'Diclofenac']
  },
  {
    category: 'Cardiovascular',
    items: ['Atorvastatin', 'Simvastatin', 'Bisoprolol', 'Propranolol', 'Ramipril', 'Lisinopril', 'Amlodipine', 'Warfarin', 'Apixaban', 'Clopidogrel', 'Low-dose aspirin (75mg)']
  },
  {
    category: 'Digestive / gastrointestinal',
    items: ['Omeprazole', 'Lansoprazole', 'Ranitidine', 'Senna', 'Movicol / Macrogol', 'Loperamide', 'Mebeverine']
  },
  {
    category: 'Mental health & nervous system',
    items: ['Sertraline', 'Citalopram', 'Fluoxetine', 'Amitriptyline', 'Diazepam', 'Zopiclone', 'Propranolol (for anxiety)']
  },
  {
    category: 'Hormonal & contraception',
    items: ['Combined contraceptive pill', 'Progesterone-only pill', 'HRT (Estradiol)', 'Levothyroxine (thyroid)']
  },
  {
    category: 'Diabetes',
    items: ['Metformin', 'Insulin', 'Gliclazide']
  },
  {
    category: 'Respiratory & allergy',
    items: ['Salbutamol inhaler', 'Steroid inhaler', 'Cetirizine', 'Loratadine']
  },
  {
    category: 'Antibiotics',
    items: ['Amoxicillin', 'Penicillin', 'Doxycycline', 'Trimethoprim']
  }
]
