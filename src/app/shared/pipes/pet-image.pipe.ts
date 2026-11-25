import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
    name: 'petImage',
    standalone: true
})
export class PetImagePipe implements PipeTransform {
    private readonly backendOrigin = new URL(environment.apiUrl).origin;

    transform(imageUrl?: string | null, petName: string = 'Pet'): string {
        if (!imageUrl) {
            return `https://placehold.co/600x450/f5f5f4/78716c?text=${encodeURIComponent(petName)}`;
        }
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
        return `${this.backendOrigin}${cleanPath}`;
    }
}