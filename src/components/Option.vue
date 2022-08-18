<script>
import { UNCHECKED, INDETERMINATE, CHECKED } from "../constants";
import { onLeftClick } from "../utils";
import Tip from "./Tip";
import ArrowIcon from "./icons/Arrow";

let arrowPlaceholder, checkMark, minusMark;

const parseContext = (context) => {
  const { props, injections } = context;
  const { node } = props;
  const { instance } = injections;
  return { node, instance };
};

const handleMouseEnterOption = (context) => (evt) => {
  const { instance, node } = parseContext(context);

  // Equivalent to `self` modifier.
  // istanbul ignore next
  if (evt.target !== evt.currentTarget) {
    return;
  }

  instance.setCurrentHighlightedOption(node, false);
};

const handleMouseDownOnArrow = (context) =>
  onLeftClick(function handleMouseDownOnOptionArrow() {
    const { instance, node } = parseContext(context);
    instance.toggleExpanded(node);
  });

const handleMouseDownOnLabelContainer = (context) =>
  onLeftClick(function handleMouseDownOnLabelContainer() {
    const { instance, node } = parseContext(context);

    if (node.isBranch && instance.disableBranchNodes) {
      instance.toggleExpanded(node);
    } else {
      instance.select(node);
    }
  });

const handleMouseDownOnRetry = (context) =>
  onLeftClick(function handleMouseDownOnRetry() {
    const { instance, node } = parseContext(context);

    instance.loadChildrenOptions(node);
  });

const shouldExpand = ({ props, injections }) => {
  const { node } = props;
  const { instance } = injections;

  return node.isBranch && instance.shouldExpand(node);
};

const renderLabelContainer = (h, context, children) => {
  return (
    <div
      class="vue-treeselect__label-container"
      onMousedown={handleMouseDownOnLabelContainer(context)}
    >
      {children}
    </div>
  );
};

const renderCheckboxContainer = (h, context, children) => {
  const { instance, node } = parseContext(context);

  if (instance.single) {
    return null;
  }
  if (instance.disableBranchNodes && node.isBranch) {
    return null;
  }

  return <div class="vue-treeselect__checkbox-container">{children}</div>;
};

const renderCheckbox = (h, context) => {
  const { instance, node } = parseContext(context);
  const checkedState = instance.forest.checkedStateMap[node.id];
  const checkboxClass = {
    "vue-treeselect__checkbox": true,
    "vue-treeselect__checkbox--checked": checkedState === CHECKED,
    "vue-treeselect__checkbox--indeterminate": checkedState === INDETERMINATE,
    "vue-treeselect__checkbox--unchecked": checkedState === UNCHECKED,
    "vue-treeselect__checkbox--disabled": node.isDisabled,
  };

  if (!checkMark) {
    checkMark = <span class="vue-treeselect__check-mark" />;
  }
  if (!minusMark) {
    minusMark = <span class="vue-treeselect__minus-mark" />;
  }

  return (
    <span class={checkboxClass}>
      {checkMark}
      {minusMark}
    </span>
  );
};

function renderSubOptionsList(h, context) {
  if (!shouldExpand(context)) {
    return null;
  }

  return (
    <div class="vue-treeselect__list">
      {renderSubOptions(h, context)}
      {renderNoChildrenTip(h, context)}
      {renderLoadingChildrenTip(h, context)}
      {renderLoadingChildrenErrorTip(h, context)}
    </div>
  );
}

const renderSubOptions = (h, context) => {
  const { node } = parseContext(context);

  if (!node.childrenStates.isLoaded) return null;

  return node.children.map((childNode) => (
    <Option node={childNode} key={childNode.id} />
  ));
};

const renderOption = (h, context) => {
  const { instance, node } = parseContext(context);
  const optionClass = {
    "vue-treeselect__option": true,
    "vue-treeselect__option--disabled": node.isDisabled,
    "vue-treeselect__option--selected": instance.isSelected(node),
    "vue-treeselect__option--highlight": node.isHighlighted,
    "vue-treeselect__option--matched":
      instance.localSearch.active && node.isMatched,
    "vue-treeselect__option--hide": !instance.shouldShowOptionInMenu(node),
  };

  if (!instance.shouldShowOptionInMenu(node)) {
    return null;
  }

  return (
    <div
      class={optionClass}
      onMouseenter={handleMouseEnterOption(context)}
      data-id={node.id}
    >
      {renderArrow(h, context)}
      {renderLabelContainer(h, context, [
        renderCheckboxContainer(h, context, [renderCheckbox(h, context)]),
        renderLabel(h, context),
      ])}
    </div>
  );
};

function renderLabel(h, { props, injections }) {
  const { node } = props;
  const { instance } = injections;
  const shouldShowCount =
    node.isBranch &&
    (instance.localSearch.active
      ? instance.showCountOnSearchComputed
      : instance.showCount);
  const count = shouldShowCount
    ? instance.localSearch.active
      ? instance.localSearch.countMap[node.id][instance.showCountOf]
      : node.count[instance.showCountOf]
    : NaN;
  const labelClassName = "vue-treeselect__label";
  const countClassName = "vue-treeselect__count";
  const customLabelRenderer = instance.$scopedSlots["option-label"];

  if (customLabelRenderer)
    return customLabelRenderer({
      node,
      shouldShowCount,
      count,
      labelClassName,
      countClassName,
    });

  return (
    <label class={labelClassName}>
      {node.label}
      {shouldShowCount && <span class={countClassName}>({count})</span>}
    </label>
  );
}

const renderArrow = (h, context) => {
  const { instance, node } = parseContext(context);

  if (instance.shouldFlattenOptions && instance.shouldShowOptionInMenu(node)) {
    return null;
  }

  if (node.isBranch) {
    const transitionProps = {
      props: {
        name: "vue-treeselect__option-arrow--prepare",
        appear: true,
      },
    };
    const arrowClass = {
      "vue-treeselect__option-arrow": true,
      "vue-treeselect__option-arrow--rotated": shouldExpand(context),
    };

    return (
      <div
        class="vue-treeselect__option-arrow-container"
        onMousedown={handleMouseDownOnArrow(context)}
      >
        <transition {...transitionProps}>
          <ArrowIcon class={arrowClass} />
        </transition>
      </div>
    );
  }

  // For leaf nodes, we render a placeholder to keep its label aligned to
  // branch nodes. Unless there is no branch nodes at all (a normal
  // non-tree select).
  if (/*node.isLeaf && */ instance.hasBranchNodes) {
    if (!arrowPlaceholder)
      arrowPlaceholder = (
        <div class="vue-treeselect__option-arrow-placeholder">&nbsp;</div>
      );

    return arrowPlaceholder;
  }

  return null;
};

const renderNoChildrenTip = (h, context) => {
  const { instance, node } = parseContext(context);

  if (!node.childrenStates.isLoaded || node.children.length) {
    return null;
  }

  return (
    <Tip type="no-children" icon="warning">
      {instance.noChildrenText}
    </Tip>
  );
};

const renderLoadingChildrenTip = (h, context) => {
  const { instance, node } = parseContext(context);

  if (!node.childrenStates.isLoading) {
    return null;
  }

  return (
    <Tip type="loading" icon="loader">
      {instance.loadingText}
    </Tip>
  );
};

const renderLoadingChildrenErrorTip = (h, context) => {
  const { instance, node } = parseContext(context);

  if (!node.childrenStates.loadingError) {
    return null;
  }

  return (
    <Tip type="error" icon="error">
      {node.childrenStates.loadingError}
      <a
        class="vue-treeselect__retry"
        title={instance.retryTitle}
        onMousedown={handleMouseDownOnRetry(context)}
      >
        {instance.retryText}
      </a>
    </Tip>
  );
};

const Option = {
  name: "vue-treeselect--option",
  functional: true,
  inject: ["instance"],

  props: {
    node: {
      type: Object,
      required: true,
    },
  },

  render(h, context) {
    const { props, injections } = context;
    const { node } = props;
    const { instance } = injections;
    const indentLevel = instance.shouldFlattenOptions ? 0 : node.level;
    const listItemClass = {
      "vue-treeselect__list-item": true,
      [`vue-treeselect__indent-level-${indentLevel}`]: true,
    };
    const transitionProps = {
      props: {
        name: "vue-treeselect__list--transition",
      },
    };

    return (
      <div class={listItemClass}>
        {renderOption(h, context)}
        {node.isBranch && (
          <transition {...transitionProps}>
            {renderSubOptionsList(h, context)}
          </transition>
        )}
      </div>
    );
  },
};

// eslint-disable-next-line vue/require-direct-export
export default Option;
</script>
