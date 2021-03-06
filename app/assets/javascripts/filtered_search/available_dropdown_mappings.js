import DropdownHint from './dropdown_hint';
import DropdownUser from './dropdown_user';
import DropdownNonUser from './dropdown_non_user';
import DropdownEmoji from './dropdown_emoji';
import NullDropdown from './null_dropdown';
import DropdownAjaxFilter from './dropdown_ajax_filter';
import DropdownUtils from './dropdown_utils';

export default class AvailableDropdownMappings {
  constructor(container, baseEndpoint, groupsOnly, includeAncestorGroups, includeDescendantGroups) {
    this.container = container;
    this.baseEndpoint = baseEndpoint;
    this.groupsOnly = groupsOnly;
    this.includeAncestorGroups = includeAncestorGroups;
    this.includeDescendantGroups = includeDescendantGroups;
  }

  getAllowedMappings(supportedTokens) {
    return this.buildMappings(supportedTokens, this.getMappings());
  }

  buildMappings(supportedTokens, availableMappings) {
    const allowedMappings = {
      hint: {
        reference: null,
        gl: DropdownHint,
        element: this.container.querySelector('#js-dropdown-hint'),
      },
    };

    supportedTokens.forEach(type => {
      if (availableMappings[type]) {
        allowedMappings[type] = availableMappings[type];
      }
    });

    return allowedMappings;
  }

  getMappings() {
    return {
      author: {
        reference: null,
        gl: DropdownUser,
        element: this.container.querySelector('#js-dropdown-author'),
      },
      assignee: {
        reference: null,
        gl: DropdownUser,
        element: this.container.querySelector('#js-dropdown-assignee'),
      },
      milestone: {
        reference: null,
        gl: DropdownNonUser,
        extraArguments: {
          endpoint: this.getMilestoneEndpoint(),
          symbol: '%',
        },
        element: this.container.querySelector('#js-dropdown-milestone'),
      },
      label: {
        reference: null,
        gl: DropdownNonUser,
        extraArguments: {
          endpoint: this.getLabelsEndpoint(),
          symbol: '~',
          preprocessing: DropdownUtils.duplicateLabelPreprocessing,
        },
        element: this.container.querySelector('#js-dropdown-label'),
      },
      'my-reaction': {
        reference: null,
        gl: DropdownEmoji,
        element: this.container.querySelector('#js-dropdown-my-reaction'),
      },
      wip: {
        reference: null,
        gl: DropdownNonUser,
        element: this.container.querySelector('#js-dropdown-wip'),
      },
      confidential: {
        reference: null,
        gl: DropdownNonUser,
        element: this.container.querySelector('#js-dropdown-confidential'),
      },
      status: {
        reference: null,
        gl: NullDropdown,
        element: this.container.querySelector('#js-dropdown-admin-runner-status'),
      },
      type: {
        reference: null,
        gl: NullDropdown,
        element: this.container.querySelector('#js-dropdown-admin-runner-type'),
      },
      tag: {
        reference: null,
        gl: DropdownAjaxFilter,
        extraArguments: {
          endpoint: this.getRunnerTagsEndpoint(),
          symbol: '~',
        },
        element: this.container.querySelector('#js-dropdown-runner-tag'),
      },
    };
  }

  getMilestoneEndpoint() {
    return `${this.baseEndpoint}/milestones.json`;
  }

  getLabelsEndpoint() {
    let endpoint = `${this.baseEndpoint}/labels.json?`;

    if (this.groupsOnly) {
      endpoint = `${endpoint}only_group_labels=true&`;
    }

    if (this.includeAncestorGroups) {
      endpoint = `${endpoint}include_ancestor_groups=true&`;
    }

    if (this.includeDescendantGroups) {
      endpoint = `${endpoint}include_descendant_groups=true`;
    }

    return endpoint;
  }

  getRunnerTagsEndpoint() {
    return `${this.baseEndpoint}/admin/runners/tag_list.json`;
  }
}
