<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    rootMargin: {
      type: String,
      default: "0px",
    },
    threshold: {
      type: Number,
      default: 1.0,
    },
  },
  mounted() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          setTimeout(() => this.$emit("intersection"), 100);
        });
      },
      {
        rootMargin: this.rootMargin,
        threshold: this.threshold,
      }
    );
    this.observer.observe(this.$el);
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.unobserve(this.$el);
    }
  },
};
</script>
