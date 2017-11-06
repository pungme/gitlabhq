import Vue from 'vue';
import epicHeader from 'ee/epics/epic_show/components/epic_header.vue';
import mountComponent from '../../../helpers/vue_mount_component_helper';
import { headerProps } from '../mock_data';

describe('epicHeader', () => {
  let vm;
  const { author } = headerProps;

  beforeEach(() => {
    const EpicHeader = Vue.extend(epicHeader);
    vm = mountComponent(EpicHeader, headerProps);
  });

  it('should render timeago tooltip', () => {
    expect(vm.$el.querySelector('time')).toBeDefined();
  });

  it('should link to author url', () => {
    expect(vm.$el.querySelector('a').href).toEqual(author.url);
  });

  it('should render author avatar', () => {
    expect(vm.$el.querySelector('img').src).toEqual(author.src);
  });

  it('should render author name', () => {
    expect(vm.$el.querySelector('.user-avatar-link').innerText.trim()).toEqual(author.name);
  });

  it('should render username tooltip', () => {
    expect(vm.$el.querySelector('.user-avatar-link span').dataset.originalTitle).toEqual(author.username);
  });
});
