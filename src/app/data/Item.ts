export class Item {
    id: string;
    name: string;
    description: string;
    longitude: number;
    latitude: number;
    times: string[];
    image: string;
    category: string;
  
    constructor(name: string, id: string, description: string, category: string, longitude: number, latitude: number, times: string[], image: string) {
      this.name = name;
      this.id = id;
      this.description = description;
      this.category = category;
      this.longitude = longitude;
      this.latitude = latitude;
      this.times = times;
      this.image = image;
    }
  }