<template>
  <treeselect :options="options" :multiple="true" :virtual-scroll="true" />
</template>

<script>
import { generateOptions } from "../utils";

export default {
  data: () => ({
    options: Object.freeze(generateOptions(2, 300)),
  }),
};
</script>
