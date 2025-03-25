import { HikeImage } from "@/types/hikes";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";

const HikeCarousel = ({ hikeImages }: { hikeImages?: HikeImage[] }) => {
    return (
        <Carousel className="w-full">
            <CarouselContent>
                {hikeImages &&
                    hikeImages.map((image, index) => (
                        <CarouselItem key={index} className="h-full">
                            <div
                                className="rounded-md w-full bg-center bg-no-repeat bg-cover h-[13rem]"
                                style={{
                                    backgroundImage: `url(${image.image_url})`,
                                }}
                            ></div>
                        </CarouselItem>
                    ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
};

export default HikeCarousel;
