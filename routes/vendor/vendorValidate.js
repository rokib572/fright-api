// Validation Schema
const yup = require('yup')
const { validate: isUUIDv } = require('uuid')

const url =
    /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm

const isUUID = (value) => {
    if (!value) return true
    return isUUIDv(value)
}

const createVendorSchema = yup.object({
    body: yup.object({
        locationsId: yup
            .string()
            .typeError('locationsId must be a string')
            .required('locationsId is required')
            .test('locationsId', 'locationsId must be uuid', (value) =>
                isUUID(value)
            ),
        website: yup
            .string()
            .typeError('website must be a string')
            .matches(url, 'Website address should be a valid URL')
            .trim()
            .nullable(),
        idFactoringCompany: yup
            .string()
            .typeError('idFactoringCompany must be a string')
            .test(
                'idFactoringCompany',
                'idFactoringCompany must be uuid',
                (value) => isUUID(value)
            )
            .nullable(),
        isFactoringCompany: yup
            .mixed()
            .oneOf(['1', '0', 1, 0], 'isFactoringCompany Should be 1 or 0'),
        requiresFactoringCompany: yup
            .number()
            .typeError('requiresFactoringCompany must be a number')
            .nullable(),
    }),
})

const documentTrackingSchema = yup.object({
    body: yup.object({
        trackingNumber: yup
            .number()
            .typeError('trackingNumber must be a number')
            .required('trackingNumber is required'),
        docType: yup
            .string()
            .oneOf(['bol'], 'docType should be bol')
            .required('docType is required'),
    }),
})
//update location schema
const updateVendorSchema = yup.object({
    body: yup.object({
        idFactoringCompany: yup
            .string()
            .typeError('idFactoringCompany must be string')
            .test(
                'idFactoringCompany',
                'idFactoringCompany must be uuid',
                (value) => isUUID(value)
            )
            .nullable(),
        isFactoringCompany: yup
            .mixed()
            .oneOf(['1', '0', 1, 0], 'isFactoringCompany Should be 1 or 0'),
        requiresFactoringCompany: yup
            .number()
            .typeError('requiresFactoringCompany must be a number')
            .nullable(),
        vendorSince: yup
            .string()
            .typeError('vendorSince must be a string')
            .matches(/^[a-zA-Z0-9\s,:.'-]*$/, 'Invalid vendorSince')
            .trim()
            .nullable(),
    }),
})

const estesRateSchema = yup.object({
    body: yup.object({
        origin: yup
            .object({
                city: yup.string().required('Origin city is required').trim(),
                province: yup
                    .string()
                    .required('Origin province is required')
                    .trim(),
                postalCode: yup
                    .string()
                    .required('Origin postalCode is required')
                    .trim(),
                country: yup
                    .string()
                    .required('Origin country is required')
                    .oneOf(
                        ['US', 'CN', 'MX', 'us', 'cn', 'mx'],
                        'Origin country should be US or CN or MX'
                    )
                    .trim(),
            })
            .required('Origin is required'),
        destination: yup
            .object({
                city: yup
                    .string()
                    .required('Destination city is required')
                    .trim(),
                province: yup
                    .string()
                    .required('Destination province is required')
                    .trim(),
                postalCode: yup
                    .string()
                    .required('Destination postalCode is required')
                    .trim(),
                country: yup
                    .string()
                    .required('Origin country is required')
                    .oneOf(
                        ['US', 'CN', 'MX', 'us', 'cn', 'mx'],
                        'Destination country should be US or CN or MX'
                    )
                    .trim(),
            })
            .required('Destination is required'),
        pieces: yup
            .array()
            .of(
                yup.object({
                    quantity: yup
                        .number()
                        .typeError('quantity must be a number')
                        .required('quantity is required'),
                    quantityType: yup
                        .string()
                        .typeError('quantityType must be a string')
                        .oneOf(
                            [
                                'BG',
                                'BR',
                                'BK',
                                'CN',
                                'CS',
                                'CY',
                                'JC',
                                'BL',
                                'BX',
                                'BD',
                                'CT',
                                'CR',
                                'DR',
                                'KT',
                                'PK',
                                'PT',
                                'RE',
                                'SK',
                                'TL',
                                'PL',
                                'PC',
                                'RL',
                                'TO',
                            ],
                            'quantityType should be one of  BG, BR, BK, CN, CS, CY, JC, BL, BX, BD, CT, CR, DR, KT, PK, PT, RE, SK, TL, PL, PC, RL, TO'
                        )
                        .required('quantityType is required'),
                    weightType: yup
                        .string()
                        .typeError('weightType must be a string')
                        .oneOf(
                            ['kg', 'lbs', '', null],
                            'weightType should be one of kg or lbs'
                        ),
                    totalWeight: yup
                        .number()
                        .typeError('totalWeight must be a number')
                        .required('totalWeight is required'),
                    freightClass: yup
                        .string()
                        .typeError('freightClass must be a string')
                        .oneOf(
                            [
                                '50',
                                '55',
                                '60',
                                '65',
                                '70',
                                '77.5',
                                '85',
                                '92.5',
                                '100',
                                '110',
                                '125',
                                '150',
                                '175',
                                '200',
                                '250',
                                '300',
                                '400',
                                '500',
                            ],
                            'freightClass should be one of  50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500'
                        )
                        .required('freightClass is required'),
                    dimLength: yup
                        .number()
                        .typeError('dimLength must be a number')
                        .required('dimLength is required'),
                    dimWidth: yup
                        .number()
                        .typeError('dimWidth must be a number')
                        .required('dimWidth is required'),
                    dimHeight: yup
                        .number()
                        .typeError('dimHeight must be a number')
                        .required('dimHeight is required'),
                })
            )
            .min(1, 'pieces must have at least one element')
            .required('pieces is required'),
        accessorials: yup
            .array()
            .of(
                yup
                    .string()
                    .typeError('accessorials must be a array of string')
                    .oneOf(
                        [
                            'AKHAZ',
                            'AKINPU',
                            'AKINS',
                            'AKLGAT',
                            'AKPRID',
                            'AKRES',
                            'AKRESP',
                            'AKSCDL',
                            'APT',
                            'BLIND',
                            'CNRDD',
                            'CONST',
                            'EXHIB',
                            'FAIRDL',
                            'FAIRPU',
                            'FARMDL',
                            'FARMPU',
                            'FRZ',
                            'GMPOIS',
                            'GROC',
                            'HAZ',
                            'HD',
                            'HDSIG',
                            'HET',
                            'HPU',
                            'INB',
                            'INP',
                            'INS',
                            'INSC',
                            'LADPU',
                            'LGATE',
                            'LGATEP',
                            'LONG12',
                            'LONG16',
                            'LONG20',
                            'LONG28',
                            'LONG40',
                            'LONG53',
                            'MINE',
                            'MINIDL',
                            'MINIPU',
                            'NCM',
                            'PRISDL',
                            'PRISPU',
                            'SCHLDL',
                            'SCHLPU',
                            'SDS',
                            'SEADL',
                            'SEADOC',
                            'SEAPU',
                            'SSM',
                            'STO',
                            'ULFEE',
                            'WORDL',
                            'WORPU',
                        ],
                        'accessorials should be one of  AKHAZ, AKINPU, AKINS, AKLGAT, AKPRID, AKRES, AKRESP, AKSCDL, APT, BLIND, CNRDD, CONST, EXHIB, FAIRDL, FAIRPU, FARMDL, FARMPU, FRZ, GMPOIS, GROC, HAZ, HD, HDSIG, HET, HPU, INB, INP, INS, INSC, LADPU, LGATE, LGATEP, LONG12, LONG16, LONG20, LONG28, LONG40, LONG53, MINE, MINIDL, MINIPU, NCM, PRISDL, PRISPU, SCHLDL, SCHLPU, SDS, SEADL, SEADOC, SEAPU, SSM, STO, ULFEE, WORDL, WORPU'
                    )
                    .required('accessorials is required')
            )
            .typeError('accessorials must be an array of strings'),
        role: yup
            .string()
            .typeError('role must be a string')
            .oneOf(['S', 'C', 'T', '', null], 'role should be one of  S, C, T')
            .nullable(),
        terms: yup
            .string()
            .typeError('terms must be a string')
            .oneOf(['P', 'C', '', null], 'terms should be one of P , C')
            .nullable(),
        available: yup
            .string()
            .typeError('available must be a string')
            .matches(
                /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
                'available should be formatted as a hh:mm:ss'
            )
            .nullable(),
        close: yup
            .string()
            .typeError('close must be a string')
            .matches(
                /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
                'close should be formatted as a hh:mm:ss'
            )
            .nullable(),
        // declaredValue is decimal at most 9 digits, with 2 decimal places
        declaredValue: yup
            .number()
            .typeError('declaredValue must be a number')
            .min(0, 'declaredValue must be greater than or equal to 0')
            .max(
                9999999999,
                'declaredValue must be less than or equal to 9999999999'
            )
            .nullable(),
        stackable: yup
            .string()
            .oneOf(
                ['Y', 'N', '', null],
                "Stackable should be one of 'Y' or 'N'"
            ),
        linearFeet: yup
            .number()
            .typeError('linearFeet must be a number')
            .min(0, 'linearFeet must be greater than or equal to 0')
            .max(100, 'linearFeet must be less than 3 digits')
            .nullable(),
        foodWarehouse: yup
            .string()
            .typeError('foodWarehouse must be a string')
            .oneOf(
                [
                    'BiLo',
                    'Butner Distribution',
                    'Food Lion',
                    'Harris Teeter',
                    'Ingles Market',
                    'Kroger',
                    'MBM',
                    'McLanes',
                    'Piggly Wiggly',
                    'Publix',
                    'Other',
                    null,
                ],
                'foodWarehouse should be one of BiLo, Butner Distribution, Food Lion, Harris Teeter, Ingles Market, Kroger, MBM, McLanes, Piggly Wiggly, Publix or Other'
            )
            .nullable(),
    }),
})

const estesDocumentSchema = yup.object({
    body: yup.object({
        trackingNumber: yup.string().required('trackingNumber  is required'),
        docType: yup
            .string()
            .oneOf(
                ['dr', 'DR', 'BOL', 'bol'],
                'docType should be one of dr, DR, BOL or bol'
            )
            .required('docType is required'),
    }),
})

const vendorCoverageSchema = yup.object({
    body: yup.object({
        province: yup
            .string()
            .min(2, 'province must be 2 characters long')
            .max(2, 'province must be 2 characters long')
            .required('province is required'),
    }),
})

const vendorApiSchema = yup.object({
    body: yup.object({
        accountNumber: yup
            .string()
            .trim()
            .required('accountNumber is required'),
        credentialsId: yup
            .string()
            .test('credentialsId', 'credentialsId must be uuid', (value) =>
                isUUID(value)
            )
            .nullable(),
        tokenA: yup.string().trim().nullable(),
        tokenB: yup.string().trim().nullable(),
        apiUrl: yup
            .string()
            .matches(url, 'apiUrl address should be a valid URL')
            .required('apiUrl is required')
            .trim(),
        label: yup.string().trim().required('label is required'),
    }),
})

const vendorAirSchema = yup.object({
    body: yup.object({
        iataCode: yup
            .string()
            .typeError('iataCode must be a string')
            .matches(/^[a-zA-Z0-9]+$/, 'iataCode must be alphanumeric')
            .min(2, 'iataCode must be 2 characters long')
            .max(3, 'iataCode must be 2 characters long')
            .required('iataCode is required'),
        awbPrefix: yup
            .string()
            .typeError('awbPrefix must be a string')
            .min(3, 'awbPrefix must be 3 characters long')
            .max(3, 'awbPrefix must be 3 characters long')
            .required('awbPrefix is required'),
        // hasCAO should be contain only 1 or 0
        hasCAO: yup
            .mixed()
            .oneOf(['1', '0', 1, 0], 'hasCAO Should be 1 or 0')
            .required('hasCAO is required'),
        hasPassenger: yup
            .mixed()
            .oneOf(['1', '0', 1, 0], 'hasPassenger Should be 1 or 0')
            .required('hasPassenger is required'),
        flag: yup
            .string()
            .typeError('flag must be a string')
            .matches(/^[a-zA-Z]*$/, 'flag should contain only alphabets')
            .min(2, 'flag must be 2 characters long')
            .max(2, 'flag must be 2 characters long'),
    }),
})

const vendorOceanSchema = yup.object({
    body: yup.object({
        fmcNumber: yup
            .string()
            .typeError('fmcNumber must be a string')
            .matches(
                /^[a-zA-Z0-9]*$/,
                'fmcNumber should contain only alphanumeric'
            )
            .required('fmcNumber is required'),
        scacNumber: yup
            .string()
            .typeError('scacNumber must be a string')
            .matches(
                /^[a-zA-Z0-9]*$/,
                'scacNumber should contain only alphanumeric'
            )
            .required('scacNumber is required'),
        flag: yup
            .string()
            .typeError('flag must be a string')
            .matches(/^[a-zA-Z]*$/, 'flag should contain only alphabets')
            .min(2, 'flag must be 2 characters long')
            .max(2, 'flag must be 2 characters long'),
    }),
})

const fedexRateSchema = yup.object({
    body: yup.object({
        origin: yup
            .object({
                city: yup.string().required('Origin city is required').trim(),
                province: yup
                    .string()
                    .required('Origin province is required')
                    .trim(),
                postalCode: yup
                    .string()
                    .required('Origin postalCode is required')
                    .trim(),
                country: yup
                    .string()
                    .required('Origin country is required')
                    .trim(),
            })
            .required('Origin is required'),
        destination: yup
            .object({
                city: yup
                    .string()
                    .required('Destination city is required')
                    .trim(),
                province: yup
                    .string()
                    .required('Destination province is required')
                    .trim(),
                postalCode: yup
                    .string()
                    .required('Destination postalCode is required')
                    .trim(),
                country: yup
                    .string()
                    .required('Destination country is required')
                    .trim(),
            })
            .required('Destination is required'),
        pieces: yup
            .array()
            .of(
                yup.object({
                    quantity: yup
                        .number()
                        .typeError('quantity must be a number')
                        .required('quantity is required'),
                    quantityType: yup
                        .string()
                        .oneOf(
                            [
                                'BOX',
                                'Box',
                                'box',
                                'PALLET',
                                'Pallet',
                                'pallet',
                                'ROLL',
                                'Roll',
                                'roll',
                                'CARTON',
                                'Carton',
                                'carton',
                                'TOTEBIN',
                                'Totebin',
                                'totebin',
                                'tote',
                                'TOTE',
                                'PL',
                                'pl',
                                'Pl',
                            ],
                            'quantityType should be one of  BOX,PALLET,ROLL,CARTON, or TOTEBIN'
                        )
                        .required('quantityType is required'),
                    weightType: yup
                        .string()
                        .typeError('weightType must be a string')
                        .oneOf(
                            ['kg', 'KG', 'Kg', 'lbs', 'Lbs', 'LBS'],
                            'weightType should be one of kg or lbs'
                        ),
                    totalWeight: yup
                        .number()
                        .typeError('totalWeight must be a decimal number')
                        .required('totalWeight is required'),
                    dimLength: yup
                        .number()
                        .typeError('dimLength must be a number')
                        .max(999, 'Maximum dimLength is 999')
                        .required('dimLength is required'),
                    dimWidth: yup
                        .number()
                        .typeError('dimWidth must be a number')
                        .max(999, 'Maximum dimWidth is 999')
                        .required('dimWidth is required'),
                    dimHeight: yup
                        .number()
                        .typeError('dimHeight must be a number')
                        .max(999, 'Maximum dimHeight is 999')
                        .required('dimHeight is required'),
                })
            )
            .min(1, 'pieces must have at least one element')
            .max(99, 'maximum 99 pieces are allowed')
            .required('pieces is required'),
        accessorials: yup
            .array()
            .of(
                yup
                    .string()
                    .oneOf(
                        ['FDXE', 'FDXG', 'FXSP', 'FXCC'],
                        'accessorials should be one of  FDXE,FXCC,FXSP,FDXG'
                    )
            )
            .typeError('accessorials must be an array of strings'),
    }),
})

const createVendorAccessorials = yup.object({
    body: yup.object({
        accessorialsId: yup
            .number()
            .typeError('accessorialsId must be a number')
            .required('accessorialsId is required'),
        vendorsAccessorialCode: yup
            .string()
            .typeError('vendorsAccessorialCode must be a string')
            .nullable(),
        labelledAs: yup
            .string()
            .typeError('labelledAs must be a string')
            .nullable(),
    }),
})

const arcBestRateSchema = yup.object({
    body: yup.object({
        origin: yup
            .object({
                city: yup.string().required('Origin city is required').trim(),
                province: yup
                    .string()
                    .required('Origin province is required')
                    .trim(),
                postalCode: yup
                    .string()
                    .required('Origin postalCode is required')
                    .trim(),
                country: yup
                    .string()
                    .required('Origin country is required')
                    .trim(),
            })
            .required('Origin is required'),
        destination: yup
            .object({
                city: yup
                    .string()
                    .required('Destination city is required')
                    .trim(),
                province: yup
                    .string()
                    .required('Destination province is required')
                    .trim(),
                postalCode: yup
                    .string()
                    .required('Destination postalCode is required')
                    .trim(),
                country: yup
                    .string()
                    .required('Destination country is required')
                    .trim(),
            })
            .required('Destination is required'),
        pieces: yup
            .array()
            .of(
                yup.object({
                    quantity: yup
                        .number()
                        .typeError('quantity must be a number')
                        .required('quantity is required'),
                    quantityType: yup
                        .string()
                        .oneOf(
                            [
                                'BX',
                                'Bx',
                                'bx',
                                'CTN',
                                'ctn',
                                'Ctn',
                                'PLT',
                                'Plt',
                                'plt',
                                'RL',
                                'rl',
                                'Rl',
                                'TOTE',
                                'tote',
                                'Tote',
                            ],
                            'quantityType should be one of BX,CTN,PLT,RL,TOTE'
                        )
                        .required('quantityType is required'),
                    weightType: yup
                        .string()
                        .oneOf(
                            ['KG', 'kg', 'LBS', 'lbs'],
                            'weightType should be one of  KG, kg, LBS, lbs'
                        )
                        .required('weightType is required'),
                    totalWeight: yup
                        .number()
                        .typeError('totalWeight must be a decimal number'),
                    freightClass: yup
                        .number()
                        .oneOf(
                            [
                                50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110,
                                125, 150, 175, 200, 250, 300, 400, 500,
                            ],
                            'freightClass should be 50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200,250, 300, 400, 500'
                        )
                        .typeError('freightClass must be a number'),
                    dimLength: yup
                        .number()
                        .typeError('dimLength must be a number')
                        .required('dimLength is required'),
                    dimWidth: yup
                        .number()
                        .typeError('dimWidth must be a number')
                        .required('dimWidth is required'),
                    dimHeight: yup
                        .number()
                        .typeError('dimHeight must be a number')
                        .required('dimHeight is required'),
                })
            )
            .min(1, 'pieces must have at least one element')
            .max(15, 'maximum 15 pieces are allowed')
            .required('pieces is required'),
    }),
})
const daylightRateSchema = yup.object({
    body: yup.object({
        origin: yup
            .object({
                city: yup
                    .string()
                    .trim()
                    .required('Origin city is required')
                    .max(
                        30,
                        'Origin city length must be less or equal 30 letter'
                    ),
                province: yup
                    .string()
                    .trim()
                    .required('Origin province is required')
                    .min(
                        2,
                        'Origin province length must be greater or equal 2 letter'
                    )
                    .max(
                        2,
                        'Origin province length must be less or equal 2 letter'
                    ),
                postalCode: yup
                    .string()
                    .trim()
                    .required('Origin postalCode is required')
                    .min(
                        5,
                        'Origin postalCode length must be greater or equal 5 letter'
                    )
                    .max(
                        10,
                        'Origin postalCode length must be less or equal 10 letter'
                    ),
                country: yup.string().nullable(),
            })
            .required('Origin is required'),
        destination: yup
            .object({
                city: yup
                    .string()
                    .trim()
                    .required('Destination city is required')
                    .max(
                        30,
                        'Destination city length must be less or equal 30 letter'
                    ),
                province: yup
                    .string()
                    .trim()
                    .required('Destination province is required')
                    .min(
                        2,
                        'Destination province length must be greater or equal 2 letter'
                    )
                    .max(
                        2,
                        'Destination province length must be less or equal 2 letter'
                    ),
                postalCode: yup
                    .string()
                    .trim()
                    .required('Destination postalCode is required')
                    .min(
                        5,
                        'Destination postalCode length must be greater or equal 5 letter'
                    )
                    .max(
                        10,
                        'Destination postalCode length must be less or equal 10 letter'
                    ),
                country: yup.string().nullable(),
            })
            .required('Destination is required'),
        pieces: yup
            .array()
            .of(
                yup.object({
                    quantity: yup
                        .number()
                        .typeError('quantity must be a number')
                        .required('quantity is required'),
                    quantityType: yup.string().nullable(),
                    weightType: yup
                        .string()
                        .typeError('weightType must be a string')
                        .oneOf(
                            ['KG', 'kg', 'LBS', 'lbs'],
                            'weightType should be one of KG, kg, LBS, lbs'
                        )
                        .required('weightType is required'),
                    totalWeight: yup
                        .number()
                        .min(1, 'totalWeight should be greater or equal to 1')
                        .max(
                            15000,
                            'totalWeight should be less or equal to 15000'
                        )
                        .typeError('totalWeight must be a decimal number')
                        .required('totalWeight is required'),
                    freightClass: yup
                        .string()
                        .trim()
                        .oneOf(
                            [
                                '50',
                                '050',
                                '55',
                                '055',
                                '60',
                                '060',
                                '65',
                                '065',
                                '70',
                                '070',
                                '77',
                                '077',
                                '77.5',
                                '85',
                                '085',
                                '92',
                                '092',
                                '92.5',
                                '100',
                                '110',
                                '125',
                                '150',
                                '175',
                                '200',
                                '250',
                                '300',
                                '400',
                                '500',
                            ],
                            "freightClass should be one of '50','050','55','055','60','060','65','065','70','070','77', " +
                                "'077','77.5','85','085','92','092','92.5','100','110','125','150','175','200','250','300','400','500'"
                        )
                        .required('freightClass is required'),
                    dimLength: yup
                        .number()
                        .typeError('dimLength must be a number'),
                    dimWidth: yup
                        .number()
                        .typeError('dimWidth must be a number'),
                    dimHeight: yup
                        .number()
                        .typeError('dimHeight must be a number'),
                })
            )
            .min(1, 'pieces must have at least one element')
            .required('pieces is required'),
        accessorials: yup
            .array()
            .of(
                yup
                    .string()
                    .typeError('accessorials must be an array of strings')
                    .oneOf(
                        [
                            'Residential Delivery',
                            'RESIDENTIAL DELIVERY',
                            'Inside Delivery',
                            'INSIDE DELIVERY',
                            'Limited Access or Constr Site Dlvry',
                            'LIMITED ACCESS OR CONSTR SITE DLVRY',
                            'Lift Gate Delivery',
                            'LIFT GATE DELIVERY',
                            'Compliance Services Fee',
                            'COMPLIANCE SERVICES FEE',
                            'Lift Gate Pickup',
                            'LIFT GATE PICKUP',
                            'Limited Access or Constr Site Pickup',
                            'LIMITED ACCESS OR CONSTR SITE PICKUP',
                            'Inside Pickup',
                            'INSIDE PICKUP',
                            'Appointment Fee',
                            'APPOINTMENT FEE',
                            'Overlength 8 ft but less than 12 ft',
                            'OVERLENGTH 8 FT BUT LESS THAN 12 FT',
                            'Overlength 12 ft but less than 20 ft',
                            'OVERLENGTH 12 FT BUT LESS THAN 20 FT',
                            'Overlength 20 ft or greater',
                            'OVERLENGTH 20 FT OR GREATER',
                        ],
                        "accessorials should be one of 'Residential Delivery', 'RESIDENTIAL DELIVERY', 'Inside Delivery', 'INSIDE DELIVERY', 'Limited Access or Constr Site Dlvry', 'LIMITED ACCESS OR CONSTR SITE DLVRY', 'Lift Gate Delivery', 'LIFT GATE DELIVERY', 'Compliance Services Fee', 'COMPLIANCE SERVICES FEE', 'Lift Gate Pickup', 'LIFT GATE PICKUP', 'Limited Access or Constr Site Pickup', 'LIMITED ACCESS OR CONSTR SITE PICKUP', 'Inside Pickup', 'INSIDE PICKUP', 'Appointment Fee', 'APPOINTMENT FEE', 'Overlength 8 ft but less than 12 ft', 'OVERLENGTH 8 FT BUT LESS THAN 12 FT', 'Overlength 12 ft but less than 20 ft', 'OVERLENGTH 12 FT BUT LESS THAN 20 FT', 'Overlength 20 ft or greater', 'OVERLENGTH 20 FT OR GREATER'"
                    )
            )
            .typeError('accessorials must be an array of strings'),
    }),
})

const usfRateSchema = yup.object({
    body: yup.object({
        origin: yup
            .object({
                city: yup.string().required('Origin city is required').trim(),
                province: yup
                    .string()
                    .required('Origin province is required')
                    .trim(),
                postalCode: yup
                    .string()
                    .required('Origin postalCode is required')
                    .trim(),
                country: yup
                    .string()
                    .required('Origin country is required')
                    .trim(),
            })
            .required('Origin is required'),
        destination: yup
            .object({
                city: yup
                    .string()
                    .required('Destination city is required')
                    .trim(),
                province: yup
                    .string()
                    .required('Destination province is required')
                    .trim(),
                postalCode: yup
                    .string()
                    .required('Destination postalCode is required')
                    .trim(),
                country: yup
                    .string()
                    .required('Destination country is required')
                    .trim(),
            })
            .required('Destination is required'),
        pieces: yup
            .array()
            .of(
                yup.object({
                    quantity: yup
                        .number()
                        .typeError('quantity must be a number')
                        .required('quantity is required'),
                    weightType: yup
                        .string()
                        .oneOf(
                            ['KG', 'kg', 'LBS', 'lbs'],
                            'weightType should be one of  KG, kg, LBS, lbs'
                        )
                        .required('weightType is required'),
                    quantityType: yup
                        .string()
                        .required('quantityType is required'),

                    totalWeight: yup
                        .number()
                        .typeError('totalWeight must be a decimal number'),
                    freightClass: yup
                        .number()
                        .oneOf(
                            [
                                50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110,
                                125, 150, 175, 200, 250, 300, 400, 500,
                            ],
                            'freightClass should be 50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200,250, 300, 400, 500'
                        )
                        .typeError('freightClass must be a number'),
                    dimLength: yup
                        .number()
                        .typeError('dimLength must be a number')
                        .min(1, 'dimLength must be between 1 and 300')
                        .max(300, 'dimLength must be between 1 and 300')
                        .required('dimLength is required'),
                    dimWidth: yup
                        .number()
                        .typeError('dimWidth must be a number')
                        .required('dimWidth is required'),
                    dimHeight: yup
                        .number()
                        .typeError('dimHeight must be a number')
                        .required('dimHeight is required'),
                })
            )
            .min(1, 'pieces must have at least one element')
            .max(5, 'maximum 5 pieces are allowed')
            .required('pieces is required'),
    }),
})
const yrcRateSchema = yup.object({
    body: yup.object({
        origin: yup
            .object({
                city: yup.string().required('Origin city is required').trim(),
                province: yup
                    .string()
                    .required('Origin province is required')
                    .trim(),
                postalCode: yup
                    .string()
                    .required('Origin postalCode is required')
                    .trim(),
                country: yup
                    .string()
                    .oneOf(
                        ['CAN', 'USA', 'can', 'usa'],
                        'origin country should be one of USA or CAN'
                    )
                    .required('Origin country is required')
                    .trim(),
            })
            .required('Origin is required'),
        destination: yup
            .object({
                city: yup
                    .string()
                    .required('Destination city is required')
                    .trim(),
                province: yup
                    .string()
                    .required('Destination province is required')
                    .trim(),
                postalCode: yup
                    .string()
                    .required('Destination postalCode is required')
                    .trim(),
                country: yup
                    .string()
                    .oneOf(
                        ['CAN', 'USA', 'can', 'usa'],
                        'destination country should be one of USA or CAN'
                    )
                    .required('Destination country is required')
                    .trim(),
            })
            .required('Destination is required'),
        pieces: yup
            .array()
            .of(
                yup.object({
                    quantity: yup
                        .number()
                        .typeError('quantity must be a number')
                        .required('quantity is required'),
                    quantityType: yup
                        .string()
                        .oneOf(
                            ['CTN', 'DRM', 'PLT', 'SKD'],
                            'quantityType should be one of  CTN, DRM, PLT, SKD'
                        )
                        .required('quantityType is required'),
                    totalWeight: yup
                        .number()
                        .max(5000, 'maximum allowed totalWeight is 5000 lbs')
                        .typeError('totalWeight must be a decimal number')
                        .required('totalWeight is required'),
                    weightType: yup
                        .string()
                        .typeError('weightType must be a string')
                        .oneOf(
                            ['kg', 'lbs', '', null],
                            'weightType should be one of kg or lbs'
                        ),
                    dimLength: yup
                        .number()
                        .max(324, 'maximum allowed dimLength is 324 inches')
                        .typeError('dimLength must be a number')
                        .required('dimLength is required'),
                    dimWidth: yup
                        .number()
                        .max(92, 'maximum allowed dimWidth is 92 inches')
                        .typeError('dimWidth must be a number')
                        .required('dimWidth is required'),
                    dimHeight: yup
                        .number()
                        .max(103, 'maximum allowed dimHeight is 103 inches')
                        .typeError('dimHeight must be a number')
                        .required('dimHeight is required'),
                })
            )
            .min(1, 'pieces must have at least one element')
            .required('pieces is required'),
        accessorials: yup
            .array()
            .of(
                yup
                    .string()
                    .oneOf(['LFTO'], 'accessorials should be one of LFTO')
                    .required('accessorials is required')
            )
            .typeError('accessorials must be an array of strings'),
    }),
})

const newPennRateSchema = yup.object({
    body: yup.object({
        origin: yup
            .object({
                city: yup.string().required('Origin city is required').trim(),
                province: yup
                    .string()
                    .required('Origin province is required')
                    .trim(),
                postalCode: yup
                    .string()
                    .required('Origin postalCode is required')
                    .trim(),
                country: yup
                    .string()
                    .oneOf(
                        ['CA', 'US'],
                        'origin country should be one of US or CA'
                    )
                    .required('Origin country is required')
                    .trim(),
            })
            .required('Origin is required'),
        destination: yup
            .object({
                city: yup
                    .string()
                    .required('Destination city is required')
                    .trim(),
                province: yup
                    .string()
                    .required('Destination province is required')
                    .trim(),
                postalCode: yup
                    .string()
                    .required('Destination postalCode is required')
                    .trim(),
                country: yup
                    .string()
                    .oneOf(
                        ['CA', 'US'],
                        'destination country should be one of US or CA'
                    )
                    .required('Destination country is required')
                    .trim(),
            })
            .required('Destination is required'),
        pieces: yup
            .array()
            .of(
                yup.object({
                    quantity: yup
                        .number()
                        .typeError('quantity must be a number')
                        .required('quantity is required'),
                    quantityType: yup
                        .string()
                        .oneOf(
                            ['CTN', 'DRM', 'PLT', 'SKD'],
                            'quantityType should be one of  CTN, DRM, PLT, SKD'
                        )
                        .required('quantityType is required'),
                    totalWeight: yup
                        .number()
                        .typeError('totalWeight must be a number')
                        .required('totalWeight is required'),
                    dimLength: yup
                        .number()
                        .typeError('dimLength must be a number')
                        .required('dimLength is required'),
                    dimWidth: yup
                        .number()
                        .typeError('dimWidth must be a number')
                        .required('dimWidth is required'),
                    dimHeight: yup
                        .number()
                        .typeError('dimHeight must be a number')
                        .required('dimHeight is required'),
                })
            )
            .min(1, 'pieces must have at least one element')
            .required('pieces is required'),
        accessorials: yup
            .array()
            .of(
                yup
                    .string()
                    .oneOf(
                        [
                            'SSM',
                            'NCM',
                            'GDM',
                            'HYM',
                            'IPM',
                            'PRU',
                            'LAP',
                            'HTM',
                            'IDM',
                            'PRD',
                            'LAD',
                        ],
                        'accessorials should be one of SSM, NCM, GDM, HYM, IPM, PRU, LAP, HTM, IDM, PRD and LAD'
                    )
                    .required('accessorials is required')
            )
            .typeError('accessorials must be an array of strings'),
    }),
})

const dhlRateSchema = yup.object({
    body: yup.object({
        origin: yup
            .object({
                city: yup
                    .string()
                    .trim()
                    .required('Origin city is required')
                    .max(
                        45,
                        'Origin city length must be less or equal 45 letter'
                    ),
                province: yup.string().nullable(),
                country: yup
                    .string()
                    .trim()
                    .required('Origin country is required')
                    .min(
                        2,
                        'Origin country length must be greater or equal 2 letter'
                    )
                    .max(
                        2,
                        'Origin country length must be less or equal 2 letter'
                    ),
                postalCode: yup
                    .string()
                    .trim()
                    .required('Origin postalCode is required'),
            })
            .required('Origin is required'),
        destination: yup
            .object({
                city: yup
                    .string()
                    .trim()
                    .required('Destination city is required')
                    .max(
                        45,
                        'Destination city length must be less or equal 45 letter'
                    ),
                province: yup.string().nullable(),
                country: yup
                    .string()
                    .trim()
                    .required('Destination country is required')
                    .min(
                        2,
                        'Destination country length must be greater or equal 2 letter'
                    )
                    .max(
                        2,
                        'Destination country length must be less or equal 2 letter'
                    ),
                postalCode: yup
                    .string()
                    .trim()
                    .required('Destination postalCode is required'),
            })
            .required('Destination is required'),
        pieces: yup
            .array()
            .of(
                yup.object({
                    quantity: yup
                        .number()
                        .typeError('quantity must be a number')
                        .required('quantity is required'),
                    quantityType: yup.string().nullable(),
                    weightType: yup
                        .string()
                        .typeError('weightType must be a string')
                        .oneOf(
                            ['KG', 'kg', 'LBS', 'lbs'],
                            'weightType should be one of KG, kg, LBS, lbs'
                        )
                        .required('weightType is required'),
                    totalWeight: yup
                        .number()
                        .typeError('totalWeight must be a decimal number')
                        .required('totalWeight is required'),
                    freightClass: yup.string().nullable(),
                    dimLength: yup
                        .number()
                        .min(1, 'dimLength should be greater or equal 1')
                        .max(
                            9999999,
                            'dimLength should be less or equal 9999999'
                        )
                        .typeError('dimLength must be a number')
                        .required('dimLength is required'),
                    dimWidth: yup
                        .number()
                        .min(1, 'dimWidth should be greater or equal 1')
                        .max(
                            9999999,
                            'dimWidth should be less or equal 9999999'
                        )
                        .typeError('dimWidth must be a number')
                        .required('dimWidth is required'),
                    dimHeight: yup
                        .number()
                        .min(1, 'dimHeight should be greater or equal 1')
                        .max(
                            9999999,
                            'dimHeight should be less or equal 9999999'
                        )
                        .typeError('dimHeight must be a number')
                        .required('dimHeight is required'),
                })
            )
            .min(1, 'pieces must have at least one element')
            .required('pieces is required'),
    }),
})

const xpoRateSchema = yup.object({
    body: yup.object({
        origin: yup
            .object({
                city: yup.string().nullable(),
                province: yup.string().nullable(),
                postalCode: yup
                    .string()
                    .trim()
                    .required('Origin postalCode is required'),
                country: yup.string().nullable(),
            })
            .required('Origin is required'),
        destination: yup
            .object({
                city: yup.string().nullable(),
                province: yup.string().nullable(),
                postalCode: yup
                    .string()
                    .trim()
                    .required('Destination postalCode is required'),
                country: yup.string().nullable(),
            })
            .required('Destination is required'),
        pieces: yup
            .array()
            .of(
                yup.object({
                    quantity: yup
                        .number()
                        .max(9999, 'quantity must be less or equal to 9999')
                        .typeError('quantity must be a number')
                        .required('quantity is required'),
                    quantityType: yup.string().nullable(),
                    weightType: yup
                        .string()
                        .typeError('weightType must be a string')
                        .oneOf(
                            ['KG', 'kg', 'LBS', 'lbs'],
                            'weightType should be one of KG, kg, LBS, lbs'
                        )
                        .required('weightType is required'),
                    totalWeight: yup
                        .number()
                        .typeError('totalWeight must be a decimal number')
                        .required('totalWeight is required'),
                    freightClass: yup
                        .string()
                        .oneOf(
                            [
                                '50',
                                '55',
                                '60',
                                '65',
                                '70',
                                '77.5',
                                '85',
                                '92.5',
                                '100',
                                '110',
                                '125',
                                '150',
                                '175',
                                '200',
                                '250',
                                '300',
                                '400',
                                '500',
                            ],
                            'freightClass should be one of 50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, and 500'
                        )
                        .required('freightClass is required'),
                    dimLength: yup
                        .number()
                        .min(1, 'dimLength should be greater or equal 1 INCH')
                        .max(330, 'dimLength should be less or equal 330 INCH')
                        .typeError('dimLength must be a number')
                        .required('dimLength is required'),
                    dimWidth: yup
                        .number()
                        .min(1, 'dimWidth should be greater or equal 1 INCH')
                        .max(94.5, 'dimWidth should be less or equal 94.5 INCH')
                        .typeError('dimWidth must be a number')
                        .required('dimWidth is required'),
                    dimHeight: yup
                        .number()
                        .min(1, 'dimHeight should be greater or equal 1 INCH')
                        .max(102, 'dimHeight should be less or equal 102 INCH')
                        .typeError('dimHeight must be a number')
                        .required('dimHeight is required'),
                })
            )
            .min(1, 'pieces must have at least one element')
            .required('pieces is required'),
    }),
})

const xpoDocumentSchema = yup.object({
    body: yup.object({
        trackingNumber: yup.string().required('trackingNumber  is required'),
        docType: yup
            .string()
            .oneOf(
                ['dr', 'DR', 'BOL', 'bol'],
                'docType should be one of dr, DR, BOL or bol'
            )
            .required('docType is required'),
    }),
})

const xpoTrackingSchema = yup.object({
    body: yup.object({
        requestID: yup.string().required('requestID is required'),
    }),
})

const forwardAirRateSchema = yup.object({
    body: yup.object({
        origin: yup
            .object({
                city: yup.string().nullable(),
                province: yup.string().nullable(),
                country: yup
                    .string()
                    .trim()
                    .required('Origin country is required')
                    .oneOf(
                        ['US', 'CN', 'MX'],
                        'Origin country should be US or CN or MX'
                    ),
                postalCode: yup
                    .string()
                    .trim()
                    .required('Origin postalCode is required'),
            })
            .required('Origin is required'),
        destination: yup
            .object({
                city: yup.string().nullable(),
                province: yup.string().nullable(),
                country: yup
                    .string()
                    .trim()
                    .required('Origin country is required')
                    .oneOf(
                        ['US', 'CN', 'MX'],
                        'Origin country should be US or CN or MX'
                    ),
                postalCode: yup
                    .string()
                    .trim()
                    .required('Destination postalCode is required'),
            })
            .required('Destination is required'),
        pieces: yup
            .array()
            .of(
                yup.object({
                    quantity: yup
                        .number()
                        .typeError('quantity must be a number')
                        .required('quantity is required'),
                    quantityType: yup.string().nullable(),
                    weightType: yup
                        .string()
                        .oneOf(
                            ['KG', 'kg', 'LBS', 'lbs'],
                            'weightType should be one of KG, kg, LBS, lbs'
                        )
                        .required('weightType is required'),
                    totalWeight: yup
                        .number()
                        .typeError('totalWeight must be a decimal number')
                        .required('totalWeight is required'),
                    freightClass: yup
                        .string()
                        .oneOf(
                            [
                                '50',
                                '55',
                                '60',
                                '65',
                                '70',
                                '77.5',
                                '85',
                                '92.5',
                                '100',
                                '110',
                                '125',
                                '150',
                                '175',
                                '200',
                                '250',
                                '300',
                                '400',
                                '500',
                            ],
                            'freightClass should be one of 50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, and 500'
                        )
                        .required('freightClass is required'),
                    dimLength: yup
                        .number()
                        .min(1, 'dimLength should be greater or equal 1')
                        .max(99999, 'dimLength should be less or equal 99999')
                        .typeError('dimLength must be a number')
                        .required('dimLength is required'),
                    dimWidth: yup
                        .number()
                        .min(1, 'dimWidth should be greater or equal 1')
                        .max(99999, 'dimWidth should be less or equal 99999')
                        .typeError('dimWidth must be a number')
                        .required('dimWidth is required'),
                    dimHeight: yup
                        .number()
                        .min(1, 'dimHeight should be greater or equal 1')
                        .max(99999, 'dimHeight should be less or equal 99999')
                        .typeError('dimHeight must be a number')
                        .required('dimHeight is required'),
                })
            )
            .min(1, 'pieces must have at least one element')
            .required('pieces is required'),
    }),
})

const jpExpressRateSchema = yup.object({
    body: yup.object({
        origin: yup
            .object({
                city: yup.string().nullable(),
                province: yup.string().nullable(),
                postalCode: yup
                    .string()
                    .trim()
                    .required('Origin postalCode is required'),
                country: yup.string().nullable(),
            })
            .required('Origin is required'),
        destination: yup
            .object({
                city: yup.string().nullable(),
                province: yup.string().nullable(),
                postalCode: yup
                    .string()
                    .trim()
                    .required('Destination postalCode is required'),
                country: yup.string().nullable(),
            })
            .required('Destination is required'),
        pieces: yup
            .array()
            .of(
                yup.object({
                    quantity: yup
                        .number()
                        .max(9999, 'quantity must be less or equal to 9999')
                        .typeError('quantity must be a number')
                        .required('quantity is required'),
                    quantityType: yup.string().nullable(),
                    weightType: yup
                        .string()
                        .typeError('weightType must be a string')
                        .oneOf(
                            ['KG', 'kg', 'LBS', 'lbs'],
                            'weightType should be one of KG, kg, LBS, lbs'
                        )
                        .required('weightType is required'),
                    totalWeight: yup
                        .number()
                        .typeError('totalWeight must be a decimal number')
                        .required('totalWeight is required'),
                    freightClass: yup
                        .string()
                        .oneOf(
                            [
                                '50',
                                '55',
                                '60',
                                '65',
                                '70',
                                '77.5',
                                '85',
                                '92.5',
                                '100',
                                '110',
                                '125',
                                '150',
                                '175',
                                '200',
                                '250',
                                '300',
                                '400',
                                '500',
                            ],
                            'freightClass should be one of 50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, and 500'
                        )
                        .required('freightClass is required'),
                    dimLength: yup
                        .number()
                        .typeError('dimLength must be a number')
                        .nullable(),
                    dimWidth: yup
                        .number()
                        .typeError('dimWidth must be a number')
                        .nullable(),
                    dimHeight: yup
                        .number()
                        .typeError('dimHeight must be a number')
                        .nullable(),
                })
            )
            .min(1, 'pieces must have at least one element')
            .required('pieces is required'),
        accessorials: yup
            .array()
            .of(
                yup
                    .string()
                    .oneOf(
                        [
                            'AIRDEL',
                            'AIRPU',
                            'BTMD',
                            'NFY',
                            'CAD',
                            'COD',
                            'CONSD',
                            'CONSP',
                            'CONCD',
                            'CONCP',
                            'JAILD',
                            'JAILP',
                            'CCD',
                            'AHAZ',
                            'ID',
                            'IP',
                            'LGD',
                            'LMTD',
                            'LMTP',
                            'OL',
                            'PVD',
                            'PVP',
                            'PRFF',
                            'SCD',
                            'SSP',
                        ],
                        'accessorials should be one of AIRDEL, AIRPU, BTMD, NFY, CAD, COD, CONSD, CONSP, CONCD, CONCP, ' +
                            'JAILD, JAILP, CCD, AHAZ, ID, IP, LGD, LMTD, LMTP, OL, PVD, PVP, PRFF, SCD or SSP'
                    )
                    .required('accessorials is required')
            )
            .typeError('accessorials must be an array of strings'),
    }),
})

const wardRateSchema = yup.object({
    body: yup.object({
        origin: yup
            .object({
                city: yup.string().nullable(),
                province: yup.string().nullable(),
                postalCode: yup
                    .string()
                    .trim()
                    .required('Origin postalCode is required'),
                country: yup.string().nullable(),
            })
            .required('Origin is required'),
        destination: yup
            .object({
                city: yup.string().nullable(),
                province: yup.string().nullable(),
                postalCode: yup
                    .string()
                    .trim()
                    .required('Destination postalCode is required'),
                country: yup.string().nullable(),
            })
            .required('Destination is required'),
        pieces: yup
            .array()
            .of(
                yup.object({
                    quantity: yup
                        .number()
                        .max(9999, 'quantity must be less or equal to 9999')
                        .typeError('quantity must be a number')
                        .required('quantity is required'),
                    quantityType: yup.string().nullable(),
                    weightType: yup
                        .string()
                        .typeError('weightType must be a string')
                        .oneOf(
                            ['KG', 'kg', 'LBS', 'lbs'],
                            'weightType should be one of KG, kg, LBS, lbs'
                        )
                        .required('weightType is required'),
                    totalWeight: yup
                        .number()
                        .typeError('totalWeight must be a decimal number')
                        .required('totalWeight is required'),
                    freightClass: yup
                        .string()
                        .oneOf(
                            [
                                '50',
                                '55',
                                '60',
                                '65',
                                '70',
                                '77.5',
                                '85',
                                '92.5',
                                '100',
                                '110',
                                '125',
                                '150',
                                '175',
                                '200',
                                '250',
                                '300',
                                '400',
                                '500',
                            ],
                            'freightClass should be one of 50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, and 500'
                        )
                        .required('freightClass is required'),
                    dimLength: yup
                        .number()
                        .typeError('dimLength must be a number')
                        .nullable(),
                    dimWidth: yup
                        .number()
                        .typeError('dimWidth must be a number')
                        .nullable(),
                    dimHeight: yup
                        .number()
                        .typeError('dimHeight must be a number')
                        .nullable(),
                })
            )
            .min(1, 'pieces must have at least one element')
            .required('pieces is required'),
        accessorials: yup
            .array()
            .of(
                yup
                    .string()
                    .oneOf(
                        [
                            'APU',
                            'APD',
                            'CONSTR',
                            'GA',
                            'GP',
                            'HAZCHG',
                            'IDC',
                            'IDCAB',
                            'IPC',
                            'RDC',
                            'RPC',
                        ],
                        'accessorials should be one of APU,ADC,CONSTR,IPC,GA,GP,HAZCHG,IDC,IDCAB,RDC,RPC'
                    )
            )
            .typeError('accessorials must be an array of strings'),
    }),
})

const vendorsLimitSchema = yup.object({
    body: yup.object({
        hasLinearFeetRule: yup
            .boolean()
            .typeError('hasLinearFeetRule must be 0 or 1')
            .required('hasLinearFeetRule  is required'),
        linearFeet: yup
            .number()
            .typeError('linearFeet must be a number variable')
            .required('linearFeet is required'),
        hasCubicFeetRule: yup
            .number()
            .typeError('hasCubicFeetRule must be a number variable')
            .required('hasCubicFeetRule is required'),
        cubicFeet: yup
            .number()
            .typeError('cubicFeet must be a number variable')
            .required('cubicFeet is required'),
    }),
})

const vendorsEquipmentTypeIdSchema = yup.object({
    body: yup.object({
        equipmentTypesId: yup
            .number()
            .typeError('equipmentTypesId is Integer value')
            .required('equipmentTypesId is required'),
    }),
})

const allVendorsRateScema = yup.object({
    body: yup.object({
        origin: yup
            .object({
                city: yup.string().required('Origin city is required').trim(),
                province: yup
                    .string()
                    .required('Origin province is required')
                    .trim(),
                postalCode: yup
                    .string()
                    .required('Origin postalCode is required')
                    .trim(),
                country: yup
                    .string()
                    .required('Origin country is required')
                    .trim(),
            })
            .required('Origin is required'),
        destination: yup
            .object({
                city: yup
                    .string()
                    .required('Destination city is required')
                    .trim(),
                province: yup
                    .string()
                    .required('Destination province is required')
                    .trim(),
                postalCode: yup
                    .string()
                    .required('Destination postalCode is required')
                    .trim(),
                country: yup
                    .string()
                    .required('Destination country is required')
                    .trim(),
            })
            .required('Destination is required'),
        pieces: yup
            .array()
            .of(
                yup.object({
                    quantity: yup
                        .number()
                        .typeError('quantity must be a number')
                        .required('quantity is required'),
                    quantityType: yup
                        .string()
                        .required('quantityType is required'),
                    weightType: yup
                        .string()
                        .oneOf(
                            ['KG', 'kg', 'LBS', 'lbs'],
                            'weightType should be one of  KG, kg, LBS, lbs'
                        )
                        .required('weightType is required'),
                    totalWeight: yup
                        .number()
                        .typeError('totalWeight must be a decimal number'),
                    freightClass: yup
                        .number()
                        .oneOf(
                            [
                                50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110,
                                125, 150, 175, 200, 250, 300, 400, 500,
                            ],
                            'freightClass should be 50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200,250, 300, 400, 500'
                        )
                        .typeError('freightClass must be a number'),
                    dimLength: yup
                        .number()
                        .typeError('dimLength must be a number')
                        .required('dimLength is required'),
                    dimWidth: yup
                        .number()
                        .typeError('dimWidth must be a number')
                        .required('dimWidth is required'),
                    dimHeight: yup
                        .number()
                        .typeError('dimHeight must be a number')
                        .required('dimHeight is required'),
                })
            )

            .required('pieces is required'),
    }),
})

const usfTrackingSchema = yup.object({
    body: yup.object({
        trackingNumber: yup.string().required('trackingNumber is required'),
    }),
})

module.exports = {
    createVendorSchema,
    updateVendorSchema,
    estesRateSchema,
    estesDocumentSchema,
    vendorCoverageSchema,
    vendorApiSchema,
    vendorAirSchema,
    vendorOceanSchema,
    fedexRateSchema,
    createVendorAccessorials,
    arcBestRateSchema,
    daylightRateSchema,
    yrcRateSchema,
    newPennRateSchema,
    usfRateSchema,
    dhlRateSchema,
    xpoRateSchema,
    xpoDocumentSchema,
    xpoTrackingSchema,
    forwardAirRateSchema,
    jpExpressRateSchema,
    vendorsLimitSchema,
    vendorsEquipmentTypeIdSchema,
    allVendorsRateScema,
    wardRateSchema,
    documentTrackingSchema,
    usfTrackingSchema,
}
