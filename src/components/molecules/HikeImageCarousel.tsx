const HikeImageCarousel = ({
    backgroundImage,
}: {
    backgroundImage: string;
}) => {
    return (
        <div
            className="h-32 w-full rounded-md bg-cover bg-no-repeat"
            style={{
                backgroundImage: `url(${backgroundImage})`,
            }}
        ></div>
    );
};

export default HikeImageCarousel;
