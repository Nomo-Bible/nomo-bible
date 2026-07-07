import type { CatalogMapEntry } from '@/types/resourceCatalog';

export const CATALOG_MAPS: CatalogMapEntry[] = [
  {
    id: 'catalog-map-churchmaps-overview',
    title: 'ChurchMaps.info — Bible Maps Collection',
    description:
      'Public-domain Bible maps including Palestine, Exodus routes, and New Testament journeys. Open the source site to browse and download.',
    imagePath: '',
    openSourceUrl: 'https://churchmaps.info/',
    sourceName: 'ChurchMaps.info',
    sourceUrl: 'https://churchmaps.info/',
    licenseNotes:
      'ChurchMaps.info states maps are public domain. Nomomartyria links to the source; images not hotlinked. Verify terms before local mirroring.',
    relatedBibleRefs: ['Exodus 14', 'Acts 13'],
    relatedTopics: ['Second Coming'],
  },
  {
    id: 'catalog-map-freebibleimages-churchmaps',
    title: 'FreeBibleImages — ChurchMaps (Public Domain)',
    description:
      'Illustrated Bible maps from the ChurchMaps public-domain set on FreeBibleImages.org.',
    imagePath: '',
    openSourceUrl: 'https://freebibleimages.org/illustrations/church-maps/',
    sourceName: 'FreeBibleImages.org / ChurchMaps',
    sourceUrl: 'https://freebibleimages.org/illustrations/church-maps/',
    licenseNotes:
      'FreeBibleImages ChurchMaps collection described as public domain on source page. Open source to view/download; not hotlinked in app.',
    relatedBibleRefs: ['Joshua 1', 'Matthew 4'],
    relatedTopics: ['Sanctuary'],
  },
  {
    id: 'catalog-map-palestine-physical',
    title: 'Physical Map of Palestine',
    description:
      'Topographical map of biblical Palestine — useful for understanding terrain in the Gospels and Old Testament history.',
    imagePath: '',
    openSourceUrl: 'https://churchmaps.info/palestine_physical.htm',
    sourceName: 'ChurchMaps.info',
    sourceUrl: 'https://churchmaps.info/',
    licenseNotes: 'Public domain per ChurchMaps.info. Read online at source URL.',
    relatedBibleRefs: ['Joshua 18', 'Luke 4:14-15'],
    relatedTopics: ['Sanctuary', 'Second Coming'],
  },
  {
    id: 'catalog-map-exodus-route',
    title: 'Exodus Route Map',
    description:
      'Map of the Exodus from Egypt through the wilderness — contextualizes the journey to Sinai and Kadesh.',
    imagePath: '',
    openSourceUrl: 'https://churchmaps.info/exodus.htm',
    sourceName: 'ChurchMaps.info',
    sourceUrl: 'https://churchmaps.info/',
    licenseNotes: 'Public domain per ChurchMaps.info. Read online at source URL.',
    relatedBibleRefs: ['Exodus 12', 'Exodus 14', 'Numbers 14'],
    relatedTopics: ['Sabbath', 'Commandments of God'],
  },
  {
    id: 'catalog-map-wikimedia-biblical',
    title: 'Wikimedia Commons — Biblical Maps Category',
    description:
      'Browse individually licensed biblical maps. Use only files with clearly compatible licenses (PD or CC-BY).',
    imagePath: '',
    openSourceUrl: 'https://commons.wikimedia.org/wiki/Category:Biblical_maps',
    sourceName: 'Wikimedia Commons',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Biblical_maps',
    licenseNotes:
      'Each file has its own license. Audit metadata before local import. CC BY-NC files are not for commercial redistribution.',
    relatedBibleRefs: [],
    relatedTopics: [],
  },
  {
    id: 'catalog-map-biblemapper-nc',
    title: 'Biblemapper Maps (CC BY-NC 4.0)',
    description:
      'Detailed Bible world maps on FreeBibleImages — useful for study but restricted to noncommercial use.',
    imagePath: '',
    openSourceUrl: 'https://freebibleimages.org/illustrations/bm-maps-bible-world/',
    sourceName: 'FreeBibleImages.org / Biblemapper',
    sourceUrl: 'https://freebibleimages.org/illustrations/bm-maps-bible-world/',
    licenseNotes:
      'CC BY-NC 4.0 — noncommercial use only. Not imported locally. Open source link provided with license recorded.',
    relatedBibleRefs: ['Acts 17', 'Revelation 2'],
    relatedTopics: ['Three Angels\' Messages'],
  },
];
