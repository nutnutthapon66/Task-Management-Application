<template>
  <v-card class="mb-3" elevation="1">
    <v-card-text class="pa-3">
      <div class="d-flex align-center justify-space-between mb-2">
        <v-skeleton-loader type="text" width="70%" />
        <v-skeleton-loader type="avatar" width="24" height="24" />
      </div>
      <v-skeleton-loader type="text" width="90%" class="mb-1" />
      <v-skeleton-loader type="text" width="60%" class="mb-3" />
      <div class="d-flex align-center">
        <v-skeleton-loader type="chip" width="60" />
      </div>
    </v-card-text>
  </v-card>
</template>
