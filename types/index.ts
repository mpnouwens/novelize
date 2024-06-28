export type Book = {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    industryIdentifiers: { type: string; identifier: string }[];
    readingModes: { text: boolean; image: boolean };
    pageCount: number;
    printedPageCount: number;
    printType: string;
    categories: string[];
    averageRating?: number;
    ratingsCount?: number;
    maturityRating: string;
    allowAnonLogging: boolean;
    contentVersion: string;
    panelizationSummary: {
      containsEpubBubbles: boolean;
      containsImageBubbles: boolean;
    };
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string;
  };
  saleInfo: {
    country: string;
    saleability: string;
    isEbook: boolean;
    listPrice?: { amount: number; currencyCode: string };
    retailPrice?: { amount: number; currencyCode: string };
    buyLink?: string;
    offers?: {
      finskyOfferType: number;
      listPrice: { amountInMicros: number; currencyCode: string };
      retailPrice: { amountInMicros: number; currencyCode: string };
      giftable: boolean;
    }[];
  };
  accessInfo: {
    country: string;
    viewability: string;
    embeddable: boolean;
    publicDomain: boolean;
    textToSpeechPermission: string;
    epub: { isAvailable: boolean; acsTokenLink?: string };
    pdf: { isAvailable: boolean };
    webReaderLink: string;
    accessViewStatus: string;
    quoteSharingAllowed: boolean;
  };
  layerInfo?: {
    layers: { layerId: string; volumeAnnotationsVersion: string }[];
  };
  searchInfo?: { textSnippet: string };
};

export type SavedBook = {
  id: string;
  title: string;
  authors: string;
  coverImage: string;
};
