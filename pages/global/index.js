// Latest version - v3.0.0 with Tree Shaking to reduce bundle size
import { Country, State, City } from "country-state-city";

export const getStaticProps = async () => {
  const countriesList = Country.getAllCountries();
  const statesList = State.getAllStates();
  const citiesList = City.getAllCities();

  return {
    props: { countries: countriesList, states: statesList, cities: citiesList },
  };
};

const Global = ({ countries, states, cities }) => {
  return (
    <div>
      <h1> All states </h1>
      {states.map((state) => (
        <div key={state.id}>
          <a>
            <h3>{state.name}</h3>
          </a>
        </div>
      ))}
    </div>
  );
};

export default Global;
