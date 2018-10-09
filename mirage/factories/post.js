import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  title(i) {
    return `Post ${i + 1}`;
  },
  body() {
    return faker.lorem.sentence();
  },
  price() {
    return faker.commerce.price();
  },
  productName() {
    return faker.commerce.productName();
  },
  color() {
    return faker.commerce.color();
  },
  productMaterial() {
    return faker.commerce.productMaterial();
  },
  id() {
    return faker.helpers.slugify(this.productName);
  }
});
