<template>
  <treeselect :options="options" :multiple="true" />
</template>

<script>
import { generateOptions } from "../utils";

export default {
  data: () => ({
    options: Object.freeze(generateOptions(2, 200)),
  }),
};
</script>
