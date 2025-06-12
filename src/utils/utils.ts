import {DecodedToken, User} from "common/model";
import jwt_decode from "jwt-decode";

export const decodeToken = (token: string | null): User | null => {
  if (!token) {
    return null;
  }

  const {
    sid,
    family_name,
    given_name,
    preferred_username,
    realm_access,
    email,
    exp,
    phone,
    name,
    customerAccountId,
  } = jwt_decode<DecodedToken>(token);

  const user: User = {
    id: sid,
    phone: phone,
    name: name,
    firstName: given_name,
    lastName: family_name,
    username: preferred_username,
    role: realm_access.roles[0],
    token: token || "",
    email,
    expireTime: exp * 1000,
    customerAccountId: customerAccountId,
  };

  return user;
};

export const formatDate = (dateTimeStart: string): string => {
  return new Date(dateTimeStart).toLocaleString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatNumber = (value: number) => {
  return Number(value).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
export const formatNumbeer = (value: number | null | undefined): number | null => {
  if (typeof value !== 'number' || isNaN(value)) return null;
  return parseFloat(value.toFixed(2));
};

export const truncateText = (text: string, limit: number) => {
  if (text.length <= limit) {
    return text;
  } else {
    return text.slice(0, limit) + "...";
  }
};

export const calculateRowSpan = (element: any) => {
  let sum = 0;

  if (!element.items) sum = 1;
  else
    element.items.forEach((item: any) => {
      sum += calculateRowSpan(item);
    });

  return sum;
};

export function formatNumberByCountryCode(
  amount: number | bigint,
  countryCode: string | undefined,
  withCurrency: boolean = true,
  withAmount: boolean = true,
) {
  const isInteger = (value: number | bigint) => {
    if (typeof value === "bigint") {
      return true;
    }
    return value % 1 === 0;
  };

  if (!countryCode) {
    return new Intl.NumberFormat("en-US", {
      style: withCurrency ? "currency" : "decimal",
    }).format(amount);
  }

  // Define a mapping of country codes to currencies and locales
  const countryCurrencyMapping: Record<
    string,
    { currency: string; locale: string }
  > = {
    AD: { currency: "EUR", locale: "ca-AD" },
    AE: { currency: "AED", locale: "fr-AE" },
    AF: { currency: "AFN", locale: "fa-AF" },
    AG: { currency: "XCD", locale: "en-AG" },
    AI: { currency: "XCD", locale: "en-AI" },
    AL: { currency: "ALL", locale: "sq-AL" },
    AM: { currency: "AMD", locale: "hy-AM" },
    AO: { currency: "AOA", locale: "pt-AO" },
    AR: { currency: "ARS", locale: "es-AR" },
    AS: { currency: "USD", locale: "en-AS" },
    AT: { currency: "EUR", locale: "de-AT" },
    AU: { currency: "AUD", locale: "en-AU" },
    AW: { currency: "AWG", locale: "nl-AW" },
    AX: { currency: "EUR", locale: "sv-AX" },
    AZ: { currency: "AZN", locale: "az-AZ" },
    BA: { currency: "BAM", locale: "bs-BA" },
    BB: { currency: "BBD", locale: "en-BB" },
    BD: { currency: "BDT", locale: "bn-BD" },
    BE: { currency: "EUR", locale: "nl-BE" },
    BF: { currency: "XOF", locale: "fr-BF" },
    BG: { currency: "BGN", locale: "bg-BG" },
    BH: { currency: "BHD", locale: "fr-BH" },
    BI: { currency: "BIF", locale: "fr-BI" },
    BJ: { currency: "XOF", locale: "fr-BJ" },
    BL: { currency: "EUR", locale: "fr-BL" },
    BM: { currency: "BMD", locale: "en-BM" },
    BN: { currency: "BND", locale: "ms-BN" },
    BO: { currency: "BOB", locale: "es-BO" },
    BQ: { currency: "USD", locale: "nl-BQ" },
    BR: { currency: "BRL", locale: "pt-BR" },
    BS: { currency: "BSD", locale: "en-BS" },
    BT: { currency: "BTN", locale: "dz-BT" },
    BV: { currency: "NOK", locale: "no-BV" },
    BW: { currency: "BWP", locale: "en-BW" },
    BY: { currency: "BYN", locale: "be-BY" },
    BZ: { currency: "BZD", locale: "en-BZ" },
    CA: { currency: "CAD", locale: "en-CA" },
    CC: { currency: "AUD", locale: "en-CC" },
    CD: { currency: "CDF", locale: "fr-CD" },
    CF: { currency: "XAF", locale: "fr-CF" },
    CG: { currency: "XAF", locale: "fr-CG" },
    CH: { currency: "CHF", locale: "de-CH" },
    CI: { currency: "XOF", locale: "fr-CI" },
    CK: { currency: "NZD", locale: "en-CK" },
    CL: { currency: "CLP", locale: "es-CL" },
    CM: { currency: "XAF", locale: "fr-CM" },
    CN: { currency: "CNY", locale: "zh-CN" },
    CO: { currency: "COP", locale: "es-CO" },
    CR: { currency: "CRC", locale: "es-CR" },
    CU: { currency: "CUP", locale: "es-CU" },
    CV: { currency: "CVE", locale: "pt-CV" },
    CW: { currency: "ANG", locale: "nl-CW" },
    CX: { currency: "AUD", locale: "en-CX" },
    CY: { currency: "EUR", locale: "el-CY" },
    CZ: { currency: "CZK", locale: "cs-CZ" },
    DE: { currency: "EUR", locale: "de-DE" },
    DJ: { currency: "DJF", locale: "fr-DJ" },
    DK: { currency: "DKK", locale: "da-DK" },
    DM: { currency: "XCD", locale: "en-DM" },
    DO: { currency: "DOP", locale: "es-DO" },
    DZ: { currency: "DZD", locale: "fr-DZ" },
    EC: { currency: "USD", locale: "es-EC" },
    EE: { currency: "EUR", locale: "et-EE" },
    EG: { currency: "EGP", locale: "fr-EG" },
    EH: { currency: "MAD", locale: "fr-EH" },
    ER: { currency: "ERN", locale: "ti-ER" },
    ES: { currency: "EUR", locale: "es-ES" },
    ET: { currency: "ETB", locale: "am-ET" },
    FI: { currency: "EUR", locale: "fi-FI" },
    FJ: { currency: "FJD", locale: "en-FJ" },
    FM: { currency: "USD", locale: "en-FM" },
    FO: { currency: "DKK", locale: "fo-FO" },
    FR: { currency: "EUR", locale: "fr-FR" },
    GA: { currency: "XAF", locale: "fr-GA" },
    GB: { currency: "GBP", locale: "en-GB" },
    GD: { currency: "XCD", locale: "en-GD" },
    GE: { currency: "GEL", locale: "ka-GE" },
    GF: { currency: "EUR", locale: "fr-GF" },
    GG: { currency: "GBP", locale: "en-GG" },
    GH: { currency: "GHS", locale: "en-GH" },
    GI: { currency: "GIP", locale: "en-GI" },
    GL: { currency: "DKK", locale: "kl-GL" },
    GM: { currency: "GMD", locale: "en-GM" },
    GN: { currency: "GNF", locale: "fr-GN" },
    GQ: { currency: "XAF", locale: "es-GQ" },
    GR: { currency: "EUR", locale: "el-GR" },
    GT: { currency: "GTQ", locale: "es-GT" },
    GU: { currency: "USD", locale: "en-GU" },
    GW: { currency: "XOF", locale: "pt-GW" },
    GY: { currency: "GYD", locale: "en-GY" },
    HK: { currency: "HKD", locale: "zh-HK" },
    HM: { currency: "AUD", locale: "en-HM" },
    HN: { currency: "HNL", locale: "es-HN" },
    HR: { currency: "HRK", locale: "hr-HR" },
    HT: { currency: "HTG", locale: "fr-HT" },
    HU: { currency: "HUF", locale: "hu-HU" },
    ID: { currency: "IDR", locale: "id-ID" },
    IE: { currency: "EUR", locale: "en-IE" },
    IL: { currency: "ILS", locale: "he-IL" },
    IM: { currency: "GBP", locale: "en-IM" },
    IN: { currency: "INR", locale: "en-IN" },
    IO: { currency: "USD", locale: "en-IO" },
    IQ: { currency: "IQD", locale: "fr-IQ" },
    IR: { currency: "IRR", locale: "fa-IR" },
    IS: { currency: "ISK", locale: "is-IS" },
    IT: { currency: "EUR", locale: "it-IT" },
    JE: { currency: "GBP", locale: "en-JE" },
    JM: { currency: "JMD", locale: "en-JM" },
    JO: { currency: "JOD", locale: "fr-JO" },
    JP: { currency: "JPY", locale: "ja-JP" },
    KE: { currency: "KES", locale: "en-KE" },
    KG: { currency: "KGS", locale: "ky-KG" },
    KH: { currency: "KHR", locale: "km-KH" },
    KI: { currency: "AUD", locale: "en-KI" },
    KM: { currency: "KMF", locale: "fr-KM" },
    KN: { currency: "XCD", locale: "en-KN" },
    KP: { currency: "KPW", locale: "ko-KP" },
    KR: { currency: "KRW", locale: "ko-KR" },
    KW: { currency: "KWD", locale: "fr-KW" },
    KY: { currency: "KYD", locale: "en-KY" },
    KZ: { currency: "KZT", locale: "kk-KZ" },
    LA: { currency: "LAK", locale: "lo-LA" },
    LB: { currency: "LBP", locale: "fr-LB" },
    LC: { currency: "XCD", locale: "en-LC" },
    LI: { currency: "CHF", locale: "de-LI" },
    LK: { currency: "LKR", locale: "si-LK" },
    LR: { currency: "LRD", locale: "en-LR" },
    LS: { currency: "LSL", locale: "en-LS" },
    LT: { currency: "EUR", locale: "lt-LT" },
    LU: { currency: "EUR", locale: "lb-LU" },
    LV: { currency: "EUR", locale: "lv-LV" },
    LY: { currency: "LYD", locale: "fr-LY" },
    MA: { currency: "MAD", locale: "fr-MA" },
    MC: { currency: "EUR", locale: "fr-MC" },
    MD: { currency: "MDL", locale: "ro-MD" },
    ME: { currency: "EUR", locale: "sr-ME" },
    MG: { currency: "MGA", locale: "fr-MG" },
    MH: { currency: "USD", locale: "en-MH" },
    MK: { currency: "MKD", locale: "mk-MK" },
    ML: { currency: "XOF", locale: "fr-ML" },
    MM: { currency: "MMK", locale: "my-MM" },
    MN: { currency: "MNT", locale: "mn-MN" },
    MO: { currency: "MOP", locale: "zh-MO" },
    MP: { currency: "USD", locale: "en-MP" },
    MR: { currency: "MRU", locale: "fr-MR" },
    MS: { currency: "XCD", locale: "en-MS" },
    MT: { currency: "EUR", locale: "mt-MT" },
    MU: { currency: "MUR", locale: "en-MU" },
    MV: { currency: "MVR", locale: "dv-MV" },
    MW: { currency: "MWK", locale: "en-MW" },
    MX: { currency: "MXN", locale: "es-MX" },
    MY: { currency: "MYR", locale: "ms-MY" },
    MZ: { currency: "MZN", locale: "pt-MZ" },
    NA: { currency: "NAD", locale: "en-NA" },
    NC: { currency: "XPF", locale: "fr-NC" },
    NE: { currency: "XOF", locale: "fr-NE" },
    NF: { currency: "AUD", locale: "en-NF" },
    NG: { currency: "NGN", locale: "en-NG" },
    NI: { currency: "NIO", locale: "es-NI" },
    NL: { currency: "EUR", locale: "nl-NL" },
    NO: { currency: "NOK", locale: "no-NO" },
    NP: { currency: "NPR", locale: "ne-NP" },
    NR: { currency: "AUD", locale: "en-NR" },
    NU: { currency: "NZD", locale: "en-NU" },
    NZ: { currency: "NZD", locale: "en-NZ" },
    OM: { currency: "OMR", locale: "fr-OM" },
    PA: { currency: "PAB", locale: "es-PA" },
    PE: { currency: "PEN", locale: "es-PE" },
    PF: { currency: "XPF", locale: "fr-PF" },
    PG: { currency: "PGK", locale: "en-PG" },
    PH: { currency: "PHP", locale: "en-PH" },
    PK: { currency: "PKR", locale: "ur-PK" },
    PL: { currency: "PLN", locale: "pl-PL" },
    PM: { currency: "EUR", locale: "fr-PM" },
    PN: { currency: "NZD", locale: "en-PN" },
    PR: { currency: "USD", locale: "en-PR" },
    PT: { currency: "EUR", locale: "pt-PT" },
    PW: { currency: "USD", locale: "en-PW" },
    PY: { currency: "PYG", locale: "es-PY" },
    QA: { currency: "QAR", locale: "fr-QA" },
    RE: { currency: "EUR", locale: "fr-RE" },
    RO: { currency: "RON", locale: "ro-RO" },
    RS: { currency: "RSD", locale: "sr-RS" },
    RU: { currency: "RUB", locale: "ru-RU" },
    RW: { currency: "RWF", locale: "rw-RW" },
    SA: { currency: "SAR", locale: "fr-SA" },
    SB: { currency: "SBD", locale: "en-SB" },
    SC: { currency: "SCR", locale: "en-SC" },
    SD: { currency: "SDG", locale: "fr-SD" },
    SE: { currency: "SEK", locale: "sv-SE" },
    SG: { currency: "SGD", locale: "en-SG" },
    SH: { currency: "SHP", locale: "en-SH" },
    SI: { currency: "EUR", locale: "sl-SI" },
    SJ: { currency: "NOK", locale: "no-SJ" },
    SK: { currency: "EUR", locale: "sk-SK" },
    SL: { currency: "SLL", locale: "en-SL" },
    SM: { currency: "EUR", locale: "it-SM" },
    SN: { currency: "XOF", locale: "fr-SN" },
    SO: { currency: "SOS", locale: "so-SO" },
    SR: { currency: "SRD", locale: "nl-SR" },
    SS: { currency: "SSP", locale: "en-SS" },
    ST: { currency: "STN", locale: "pt-ST" },
    SV: { currency: "USD", locale: "es-SV" },
    SX: { currency: "ANG", locale: "nl-SX" },
    SY: { currency: "SYP", locale: "fr-SY" },
    SZ: { currency: "SZL", locale: "en-SZ" },
    TC: { currency: "USD", locale: "en-TC" },
    TD: { currency: "XAF", locale: "fr-TD" },
    TF: { currency: "EUR", locale: "fr-TF" },
    TG: { currency: "XOF", locale: "fr-TG" },
    TH: { currency: "THB", locale: "th-TH" },
    TJ: { currency: "TJS", locale: "tg-TJ" },
    TK: { currency: "NZD", locale: "en-TK" },
    TL: { currency: "USD", locale: "pt-TL" },
    TM: { currency: "TMT", locale: "tk-TM" },
    TN: { currency: "TND", locale: "fr-TN" },
    TO: { currency: "TOP", locale: "en-TO" },
    TR: { currency: "TRY", locale: "tr-TR" },
    TT: { currency: "TTD", locale: "en-TT" },
    TV: { currency: "AUD", locale: "en-TV" },
    TZ: { currency: "TZS", locale: "sw-TZ" },
    UA: { currency: "UAH", locale: "uk-UA" },
    UG: { currency: "UGX", locale: "en-UG" },
    US: { currency: "USD", locale: "en-US" },
    UY: { currency: "UYU", locale: "es-UY" },
    UZ: { currency: "UZS", locale: "uz-UZ" },
    VA: { currency: "EUR", locale: "it-VA" },
    VC: { currency: "XCD", locale: "en-VC" },
    VE: { currency: "VES", locale: "es-VE" },
    VG: { currency: "USD", locale: "en-VG" },
    VI: { currency: "USD", locale: "en-VI" },
    VN: { currency: "VND", locale: "vi-VN" },
    VU: { currency: "VUV", locale: "fr-VU" },
    WF: { currency: "XPF", locale: "fr-WF" },
    WS: { currency: "WST", locale: "en-WS" },
    YE: { currency: "YER", locale: "fr-YE" },
    YT: { currency: "EUR", locale: "fr-YT" },
    ZA: { currency: "ZAR", locale: "en-ZA" },
    ZM: { currency: "ZMW", locale: "en-ZM" },
    ZW: { currency: "ZWL", locale: "en-ZW" },
  };

  // Retrieve currency and locale based on country code
  const { currency, locale } = countryCurrencyMapping[countryCode] || {
    currency: "USD",
    locale: "en-US",
  };

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: withCurrency ? "currency" : "decimal",
      currency: currency,
    });

    if (!withAmount) {
      const parts = formatter.formatToParts(amount);
      const currencySymbol =
        parts.find((part) => part.type === "currency")?.value || "";
      return currencySymbol;
    }

    return formatter.format(amount);
  } catch (error) {
    console.error(
      `Error formatting amount with locale ${locale} and currency ${currency}`,
    );
    return new Intl.NumberFormat("en-US", {
      style: withCurrency ? "currency" : "decimal",
      currency: "USD",
    }).format(amount);
  }
}
