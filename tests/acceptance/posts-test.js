import { module, test } from 'qunit';
import { visit, currentURL, pauseTest, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { default as window, reset } from 'ember-window-mock';

module('Acceptance | posts', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.afterEach(() => {
    reset();
  });

  test('visiting / displays a list of posts', async function(assert) {
    server.createList('post', 10);
    await visit('/');
    assert.dom('[data-test=post-item]').exists({ count: 10 });
  });

  test('viewing post details', async function(assert) {
    server.create('post', {
      title: 'Intro to testing',
      body: 'I love testing!'
    });
    await visit('/posts/1');
    assert.dom('[data-test=post-title]').hasText('Intro to testing');
    assert.dom('[data-test=post-body]').hasText('I love testing!');
  });

  test('deleting a post', async function(assert) {
    server.create('post', {
      title: 'Intro to testing',
      body: 'I love testing!'
    });

    window.confirm = () => true;

    await visit('/');
    await click('[data-test=delete-post]');
    assert.dom('[data-test=post-item]').exists({ count: 0 });
  });

  test('canceling deleting a post', async function(assert) {
    server.create('post', {
      title: 'Intro to testing',
      body: 'I love testing!'
    });

    window.confirm = () => false;

    await visit('/');
    await click('[data-test=delete-post]');
    assert.dom('[data-test=post-item]').exists({ count: 1 });
  });

  test('writing a post', async function(assert) {
    await visit('/posts/new');
    await fillIn('#title', 'Intro to testing');
    await fillIn('#body', 'I love testing!');
    await click('[data-test=publish]');
    assert.equal(currentURL(), '/posts/1');
    assert.dom('[data-test=post-title]').hasText('Intro to testing');
    assert.dom('[data-test=post-body]').hasText('I love testing!');

    // useful in some situations. for example, if you have a page with a single form and the user
    // fills it out and hits save and there is no page transition.
    let [ post ] = server.db.posts;
    assert.equal(post.title, 'Intro to testing');
    assert.equal(post.body, 'I love testing!');
  });
});

