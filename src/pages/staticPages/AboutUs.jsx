function AboutUs() {
  return (
    <div className="font-primary">
      <div className="px-36 bg-primaryBG py-10">
        <h1 className="text-center font-medium text-4xl my-8">About Us</h1>
        <p className="text-justify text-gray-500">
          We are compelled by our resolve to make every home beautiful without
          impacting the mother earth. Our décor products at Thread Story goes
          through rigorous design process. The box which comes at your doorstep
          is “a perfect art piece”.
        </p>
        <h2 className="my-8 text-center font-medium text-2xl">
          Supporting the Communities:
        </h2>
        <p className="text-justify text-gray-500">
          Though all our products are designed in bustling vibe of Mumbai city,
          we take help of artisans from rural India and from the home grown
          artists from different cities to manufacture few of our products. This
          not only provides them a living but sense of belonging. We are proud
          of their support and partnership.
        </p>
      </div>
      <div className="px-36 flex py-10 gap-20">
        <div className=" basis-1/2">
          <img src="../../images/Sling_bag.png" className=" size-full" />
        </div>
        <div className="basis-1/2 text-justify text-gray-500">
          <h1 className="mb-5 text-red-500">
            FOUNDER <br />
            DARSHANA PARIYAR
          </h1>
          <p className="mb-5">
            In Greek mythology, strong women loomed tapestry to give voice to
            their opinions and a platform to their skill. Our founder, a Dental
            Surgeon by profession, tries to reclaim this art and is creating
            magic with the same. Since she was a child, she has had a peculiar
            inclination toward creative art. Probably it was this interest in
            creating that manifested in her very first macramé product. Made in
            leisure time with the help of basic sources such as Youtube videos
            and woolen threads. This were the first steps towards
            conceptualizing the Thread Story. The process, at its initial stage
            was one of incessant effort and will. She persisted in getting the
            right material for authentically appealing designs.
          </p>
          <p>
            The very name Thread Story comes in because the creator believes
            that her work has the capability of melting into people’s lives and
            slowly becoming a part of their stories. The very same rationale is
            reflected in her work where she creates these homely, warmth giving
            tapestries to make a home feel more like one. Vipal is a strong
            woman who let the artist in her come forth to make an endeavour.
          </p>
        </div>
      </div>

      <div className="px-36 bg-primaryBG py-10">
        <h1 className="text-red-500 text-center my-9 font-semibold">
          HOW WE CREATE
        </h1>
        <div className="flex gap-8">
          <div className="basis-1/4">
            <h1 className="font-semibold mb-4">Concept Curation</h1>
            <p className="text-gray-500 text-justify">
              The product conceptualisation is worked out with immense
              deliberation and a complementary sense of aesthetic. May it be
              chic boho utility pieces, subtle urban tapestries or tropical
              themes: unique concepts are carved.
            </p>
          </div>
          <div className="basis-1/4">
            <h1 className="font-semibold mb-4">Prototype Creation</h1>
            <p className="text-gray-500 text-justify">
              With a careful play of permutations and combinations of design,
              dimension and utility; the product prototypes form basis for the
              evolution of the final work.
            </p>
          </div>
          <div className="basis-1/4">
            <h1 className="font-semibold mb-4">Standard Yardstick</h1>
            <p className="text-gray-500 text-justify">
              Design features and techniques incorporated in particular
              elements, across the range of products are set benchmarks. This
              ensures consistency and symmetry throughout the collections.
            </p>
          </div>
          <div className="basis-1/4">
            <h1 className="font-semibold mb-4">Quality Check</h1>
            <p className="text-gray-500 text-justify">
              Products are scanned to the minutest details for defects or
              inconsistency; to only dispatch them in perfect condition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
