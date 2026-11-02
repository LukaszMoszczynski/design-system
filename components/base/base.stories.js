import { renderBase } from './base.template.js';

export default {
  title: 'Foundations/Base',
  render: (args) => renderBase(args),
  args: {
    heading: 'Zażółć gęślą jaźń',
    text: 'Pchnąć w tę łódź jeża lub ośm skrzyń fig.',
  },
};

export const Default = {};
