<template>
  <treeselect :multiple="true" :options="options" :value="value" />
</template>

<script>
export default {
  data: () => ({
    options: [
      {
        id: "folder",
        label: "Checkable Folder",
        isCheckable: true,
        children: [
          {
            id: "uncheckable-checked",
            label: "Checked",
            isCheckable: false,
          },
          {
            id: "uncheckable-unchecked",
            label: "Unchecked",
            isCheckable: false,
          },
          {
            id: "item-1",
            label: "Item",
            isCheckable: true,
          },
        ],
      },
      {
        id: "uncheackable-folder",
        label: "Uncheackable Folder",
        isCheckable: false,
        children: [
          {
            id: "item-2",
            label: "Item",
          },
          {
            id: "item-3",
            label: "Item",
          },
        ],
      },
    ],
    value: ["uncheckable-checked"],
  }),
};
</script>
