declare module "google-translate-api-x" {
  export default function translate(
    query:
      | string
      | googleTranslateApi.IQueryType[]
      | { [key: string]: googleTranslateApi.IQueryType },
    opts?: googleTranslateApi.IOptions,
    requestOptions?: object
  ): googleTranslateApi.ITranslateResponseType<typeof query>;
}

declare namespace googleTranslateApi {
  interface ITranslationOptions {
    from?: string;
    to?: string;
    forceFrom?: boolean;
    forceTo?: boolean;
    autoCorrect?: boolean;
  }

  export interface IOptions extends ITranslationOptions {
    tld?: string;
    requestFunction?: Function | string;
  }

  export interface ITranslateLanguage {
    didYouMean: boolean;
    iso: string;
  }

  export interface ITranslateText {
    autoCorrected: boolean;
    value: string;
    didYouMean: boolean;
  }

  export interface ITranslateResponse {
    text: string;
    pronunciation: string;
    from: {
      language: ITranslateLanguage;
      text: ITranslateText;
    };
    raw: string;
  }

  interface IOptionQuery extends ITranslationOptions {
    text: string;
  }

  type IQueryType = string | IOptionQuery;

  type ITranslateResponseType<T> = T extends string
    ? Promise<ITranslateResponse>
    : T extends IQueryType[]
    ? Promise<ITranslateResponse[]>
    : Promise<{ [key in keyof T]: ITranslateResponse }>;

  export enum languages {
    "auto" = "Automatic",
    "af" = "Afrikaans",
    "sq" = "Albanian",
    "am" = "Amharic",
    "ar" = "Arabic",
    "hy" = "Armenian",
    "as" = "Assamese",
    "ay" = "Aymara",
    "az" = "Azerbaijani",
    "bm" = "Bambara",
    "eu" = "Basque",
    "be" = "Belarusian",
    "bn" = "Bengali",
    "bho" = "Bhojpuri",
    "bs" = "Bosnian",
    "bg" = "Bulgarian",
    "ca" = "Catalan",
    "ceb" = "Cebuano",
    "ny" = "Chichewa",
    "zh-CN" = "Chinese (Simplified)",
    "zh-TW" = "Chinese (Traditional)",
    "co" = "Corsican",
    "hr" = "Croatian",
    "cs" = "Czech",
    "da" = "Danish",
    "dv" = "Dhivehi",
    "doi" = "Dogri",
    "nl" = "Dutch",
    "en" = "English",
    "eo" = "Esperanto",
    "et" = "Estonian",
    "ee" = "Ewe",
    "tl" = "Filipino",
    "fi" = "Finnish",
    "fr" = "French",
    "fy" = "Frisian",
    "gl" = "Galician",
    "ka" = "Georgian",
    "de" = "German",
    "el" = "Greek",
    "gn" = "Guarani",
    "gu" = "Gujarati",
    "ht" = "Haitian Creole",
    "ha" = "Hausa",
    "haw" = "Hawaiian",
    "iw" = "Hebrew",
    "he" = "Hebrew",
    "hi" = "Hindi",
    "hmn" = "Hmong",
    "hu" = "Hungarian",
    "is" = "Icelandic",
    "ig" = "Igbo",
    "ilo" = "Ilocano",
    "id" = "Indonesian",
    "ga" = "Irish",
    "it" = "Italian",
    "ja" = "Japanese",
    "jw" = "Javanese",
    "kn" = "Kannada",
    "kk" = "Kazakh",
    "km" = "Khmer",
    "rw" = "Kinyarwanda",
    "gom" = "Konkani",
    "ko" = "Korean",
    "kri" = "Krio",
    "ku" = "Kurdish (Kurmanji)",
    "ckb" = "Kurdish (Sorani)",
    "ky" = "Kyrgyz",
    "lo" = "Lao",
    "la" = "Latin",
    "lv" = "Latvian",
    "ln" = "Lingala",
    "lt" = "Lithuanian",
    "lg" = "Luganda",
    "lb" = "Luxembourgish",
    "mk" = "Macedonian",
    "mai" = "Maithili",
    "mg" = "Malagasy",
    "ms" = "Malay",
    "ml" = "Malayalam",
    "mt" = "Maltese",
    "mi" = "Maori",
    "mr" = "Marathi",
    "mni-Mtei" = "Meiteilon (Manipuri)",
    "lus" = "Mizo",
    "mn" = "Mongolian",
    "my" = "Myanmar (Burmese)",
    "ne" = "Nepali",
    "no" = "Norwegian",
    "or" = "Odia (Oriya)",
    "om" = "Oromo",
    "ps" = "Pashto",
    "fa" = "Persian",
    "pl" = "Polish",
    "pt" = "Portuguese",
    "pa" = "Punjabi",
    "qu" = "Quechua",
    "ro" = "Romanian",
    "ru" = "Russian",
    "sm" = "Samoan",
    "sa" = "Sanskrit",
    "gd" = "Scots Gaelic",
    "nso" = "Sepedi",
    "sr" = "Serbian",
    "st" = "Sesotho",
    "sn" = "Shona",
    "sd" = "Sindhi",
    "si" = "Sinhala",
    "sk" = "Slovak",
    "sl" = "Slovenian",
    "so" = "Somali",
    "es" = "Spanish",
    "su" = "Sundanese",
    "sw" = "Swahili",
    "sv" = "Swedish",
    "tg" = "Tajik",
    "ta" = "Tamil",
    "tt" = "Tatar",
    "te" = "Telugu",
    "th" = "Thai",
    "ti" = "Tigrinya",
    "ts" = "Tsonga",
    "tr" = "Turkish",
    "tk" = "Turkmen",
    "ak" = "Twi",
    "uk" = "Ukrainian",
    "ur" = "Urdu",
    "ug" = "Uyghur",
    "uz" = "Uzbek",
    "vi" = "Vietnamese",
    "cy" = "Welsh",
    "xh" = "Xhosa",
    "yi" = "Yiddish",
    "yo" = "Yoruba",
    "zu" = "Zulu",
  }

  namespace languages {
    /**
     * Returns the ISO 639-1 code of the desiredLang – if it is supported by Google Translate
     * @param desiredLang – the name or the code(case sensitive) of the desired language
     * @returns The ISO 639-1 code of the language or false if the language is not supported
     */
    function getCode(desiredLang: string): string | boolean;

    /**
     * Returns true if the desiredLang is supported by Google Translate and false otherwise
     * @param desiredLang – the ISO 639-1 code or the name of the desired language
     */
    function isSupported(desiredLang: string): boolean;
  }
}
