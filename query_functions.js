import { User } from './models';

export const initiateAggregate = (model) => (
  model.aggregate()
);

export const addNameFilter = (aggregate, name = undefined) => {
  return name ? aggregate.match({name}) : aggregate;
};

export const addLocationFilter = (aggregate, location, radius_in_miles) => {
  return location ? aggregate.near({
                                    "near": location,
                                    "spherical": true,
                                    "maxDistance": radius_in_miles,
                                    "distanceField": "distance",
                                    "distanceMultiplier": 1000 * 6378.1
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
