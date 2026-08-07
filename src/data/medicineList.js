// A curated, categorized list of commonly prescribed UK medicines, organised
// by body system so it maps to the health history sections in the intake form.
//
// Medicine NAMES only — no dosing, interaction or clinical guidance text,
// which stays inside the licensed BNF and is not reproduced here. Makéda
// checks interactions via her own NIMH resource (linked in the back office).

export const medicineCategories = [
  {
    category: 'Pain relief & anti-inflammatory',
    items: [
      'Paracetamol', 'Ibuprofen', 'Aspirin', 'Naproxen', 'Codeine', 'Co-codamol',
      'Tramadol', 'Diclofenac', 'Meloxicam', 'Amitriptyline (for pain)',
      'Gabapentin', 'Pregabalin', 'Colchicine', 'Allopurinol'
    ]
  },
  {
    category: 'Cardiovascular',
    items: [
      'Atorvastatin', 'Simvastatin', 'Rosuvastatin', 'Pravastatin',
      'Bisoprolol', 'Propranolol', 'Atenolol', 'Carvedilol',
      'Ramipril', 'Lisinopril', 'Perindopril', 'Losartan', 'Candesartan',
      'Amlodipine', 'Felodipine', 'Diltiazem', 'Verapamil',
      'Furosemide', 'Bendroflumethiazide', 'Spironolactone',
      'Warfarin', 'Apixaban', 'Rivaroxaban', 'Edoxaban', 'Clopidogrel',
      'Low-dose aspirin (75mg)', 'Digoxin', 'Isosorbide mononitrate', 'GTN spray'
    ]
  },
  {
    category: 'Digestive / gastrointestinal',
    items: [
      'Omeprazole', 'Lansoprazole', 'Pantoprazole', 'Esomeprazole',
      'Ranitidine', 'Famotidine', 'Gaviscon', 'Peppermint oil capsules',
      'Senna', 'Movicol / Macrogol', 'Lactulose', 'Bisacodyl', 'Docusate',
      'Loperamide', 'Mebeverine', 'Buscopan (hyoscine)', 'Domperidone',
      'Metoclopramide', 'Mesalazine', 'Ursodeoxycholic acid', 'Creon (pancreatin)'
    ]
  },
  {
    category: 'Mental health & nervous system',
    items: [
      'Sertraline', 'Citalopram', 'Escitalopram', 'Fluoxetine', 'Paroxetine',
      'Venlafaxine', 'Duloxetine', 'Mirtazapine', 'Amitriptyline', 'Trazodone',
      'Diazepam', 'Lorazepam', 'Zopiclone', 'Melatonin',
      'Propranolol (for anxiety)', 'Quetiapine', 'Olanzapine', 'Risperidone',
      'Lithium', 'Lamotrigine', 'Sodium valproate', 'Levetiracetam',
      'Carbamazepine', 'Phenytoin', 'Donepezil', 'Methylphenidate',
      'Sumatriptan', 'Topiramate'
    ]
  },
  {
    category: 'Hormonal, contraception & thyroid',
    items: [
      'Combined contraceptive pill', 'Progesterone-only pill', 'Contraceptive implant',
      'Contraceptive injection (Depo-Provera)', 'Hormonal coil (Mirena)',
      'HRT — Estradiol (tablet)', 'HRT — Estradiol (patch/gel)', 'HRT — Progesterone',
      'Tibolone', 'Testosterone', 'Levothyroxine (thyroid)', 'Carbimazole',
      'Prednisolone', 'Hydrocortisone', 'Tamoxifen', 'Anastrozole',
      'Finasteride', 'Tamsulosin'
    ]
  },
  {
    category: 'Diabetes & metabolic',
    items: [
      'Metformin', 'Gliclazide', 'Sitagliptin', 'Empagliflozin', 'Dapagliflozin',
      'Insulin (long-acting)', 'Insulin (short-acting)', 'Semaglutide (Ozempic/Wegovy)',
      'Liraglutide', 'Pioglitazone', 'Orlistat'
    ]
  },
  {
    category: 'Respiratory & allergy',
    items: [
      'Salbutamol inhaler', 'Steroid inhaler (e.g. Clenil, Pulmicort)',
      'Combination inhaler (e.g. Seretide, Symbicort, Fostair)',
      'Montelukast', 'Tiotropium', 'Carbocisteine',
      'Cetirizine', 'Loratadine', 'Fexofenadine', 'Chlorphenamine (Piriton)',
      'Nasal steroid spray', 'EpiPen / adrenaline auto-injector'
    ]
  },
  {
    category: 'Antibiotics & antimicrobials',
    items: [
      'Amoxicillin', 'Penicillin V', 'Co-amoxiclav', 'Flucloxacillin',
      'Doxycycline', 'Trimethoprim', 'Nitrofurantoin', 'Clarithromycin',
      'Erythromycin', 'Metronidazole', 'Ciprofloxacin', 'Cefalexin',
      'Fluconazole', 'Aciclovir', 'Clotrimazole'
    ]
  },
  {
    category: 'Skin',
    items: [
      'Hydrocortisone cream', 'Betamethasone', 'Emollients / moisturising creams',
      'Isotretinoin', 'Lymecycline', 'Methotrexate', 'Ketoconazole shampoo'
    ]
  },
  {
    category: 'Supplements & vitamins',
    items: [
      'Vitamin D', 'Vitamin B12', 'Folic acid', 'Iron (ferrous sulphate/fumarate)',
      'Calcium', 'Magnesium', 'Omega-3 / fish oil', 'Multivitamin',
      'Probiotics', 'Zinc', 'Vitamin C', 'Turmeric / curcumin',
      'Glucosamine', 'Co-enzyme Q10', 'Ashwagandha', 'St John\u2019s Wort'
    ]
  }
]
