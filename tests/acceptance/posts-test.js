import { module, test } from 'qunit';
import { visit, currentURL, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import window, { reset } from 'ember-window-mock';

module('Acceptance | posts', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  hooks.afterEach(function() {
    reset();
  });

  test('deleting a post', async function(assert) {
    server.createList('post', 1);
    window.confirm = () => true;

    await visit('/');
    await click('[data-test="delete-post"]');
    assert.dom('[data-test="post"]').exists({ count: 0 });
  });

  test('canceling deleting a post', async function(assert) {
    server.createList('post', 1);
    window.confirm = () => false;

    await visit('/');
    await click('[data-test="delete-post"]');
    assert.dom('[data-test="post"]').exists({ count: 1 });
  });

  test('writing a post', async function(assert) {
    await visit('/posts/new');
    await fillIn('#title', 'Intro to testing');
    await fillIn('#body', 'I love testing!');
    await click('[data-test="publish"]');

    assert.equal(currentURL(), '/posts/1');
    assert.dom('[data-test="post-title"]').hasText('Intro to testing');
    assert.dom('[data-test="post-body"]').hasText('I love testing!');
  });

  test('visiting / displays a list of posts', async function(assert) {
    server.createList('post', 10);

    await visit('/');

    assert.equal(currentURL(), '/');
    assert.dom('[data-test="post"]').exists({ count: 10 });
  });

  test('viewing the details of a post', async function(assert) {
    server.create('post', {
      title: 'Post 1',
      body: 'My post body'
    });

    await visit('/posts/1');

    assert.dom('[data-test="post-title"]').hasText('Post 1');
    assert.dom('[data-test="post-body"]').hasText('My post body');
  });
});
