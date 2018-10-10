import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  id(i) {
    return i + 1;
  },
  title(i) {
    return `Post ${i + 1}`;
  },
  body() {
    return faker.lorem.sentence();
  }
});
