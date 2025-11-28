import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

export default function Hero({ deviceType }) {
    return (

        <Carousel
            swipeable={true}
            draggable={true}
            showDots={true}
            responsive={responsive}
            ssr={true}
            infinite={true}
            autoPlay={deviceType !== "mobile"}
            autoPlaySpeed={2000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            deviceType={deviceType}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
        >
            <div className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[500px] overflow-hidden px-2">
                <img
                    src="/Hero-Images/book-sale-4.jfif"
                    alt="Hero 1"
                    className="w-full h-full object-fit"
                />
            </div>
            <div className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[500px] overflow-hidden px-2">
                <img
                    src="/Hero-Images/book-sale-2.jfif"
                    alt="Hero 1"
                    className="w-full h-full object-fit"
                />
            </div> 
            <div className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[500px] overflow-hidden px-2">
                <img
                    src="/Hero-Images/book-sale-3.jfif"
                    alt="Hero 1"
                    className="w-full h-full object-fit"
                />
            </div>

        </Carousel>

    );
}
