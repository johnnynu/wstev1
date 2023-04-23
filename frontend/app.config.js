import Constants from "expo-constants";
import * as dotenv from "dotenv";

dotenv.config();

const extra = {
  unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY
};

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    ...extra
  }
});
