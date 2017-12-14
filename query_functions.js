import { User } from './models';

export const initiateAggregate = (model) => (
  model.aggregate()
);

export const addNameFilter = (aggregate, name = undefined) => {
  return name ? aggregate.match({name}) : aggregate;
};

export const addLocationFilter = (aggregate, location = undefined, radius_in_miles = 1) => {
  return location ? aggregate.near({
                                    "near": location,
                                    "spherical": true,
                                    "maxDistance": radius_in_miles,
                                    "distanceField": "distance",
                                    "distanceMultiplier": 3963.2
                                  })
                  : aggregate
};

export const addOutletFilter = (aggregate, outlets = undefined) => {
  return outlets ? aggregate.match({outlets}) : aggregate;
};

export const executeAggregate = aggregate => {
  return aggregate.exec((err, result) => {
    if (err) {
      return err;
    } else {
      return result;
    }
  })
};
