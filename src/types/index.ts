export interface FeatureProperties {
  NOMGEO: string;
  CVEGEO: string;
  [key: string]: unknown;
}

export interface SelectedFeature {
  type: string;
  properties: FeatureProperties;
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
  id?: string | number;
}

export interface IndicatorItem {
  label: string;
  value: string;
}
