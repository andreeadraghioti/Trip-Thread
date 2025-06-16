export interface Trip {
  id: number;
  tripName: string;
  city: string;
  createdAt: string;
  places: Place[];
}

export interface TripRequest {
  city: string;
  tripName: string;
  places: Place[];
}

export interface PlacesRequest {
  activities: string[];
  city: string;
  group: string;
  budget: string;
}

export interface Place {
  name: string;
  type?: string;
  description?: string | null;
  phone?: string | null;
  website?: string | null;
  price?: string;
  address?: string;
  open?: boolean | null;
}

