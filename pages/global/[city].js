// Latest version - v3.0.0 with Tree Shaking to reduce bundle size
import { Country, State, City } from "country-state-city";

export const getStaticPaths = async () => {
  let cities = City.getAllCities();

  const paths = cities.map((cityVal) => {
    return {
      params: { city: cityVal.name },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const city = context.params.city;

  return {
    props: { city: city },
  };
};

const CityDetails = ({ city }) => {
  return <h1>city</h1>;
};
