<script setup>
import { ref, onBeforeMount, watch, toRaw } from "vue";
import { asciiToHexa } from "@/utils/utils.js";

const emit = defineEmits(["update:modelValue"]);
const values = ref([]);
const props = defineProps({
	options: { type: Array, default: [] },
	values: { type: Array, default: null },
	placeholder: { type: String, default: "" },
});

watch(values, (newValues) => {
	emit("update:modelValue", toRaw(newValues));
});
</script>

<template>
	<Dropdown v-model="values" :options="options" :placeholder="placeholder">
		<template #value="slotProps">
			<b> {{ placeholder + " " }} </b>
			<span
				v-if="slotProps.value"
				class="product-badge"
				:style="
					'color:black;' + 'background-color:' + asciiToHexa(slotProps.value)
				"
			>
				{{ slotProps.value }}
			</span>
		</template>
		<template #option="slotProps">
			<span
				v-if="slotProps.option"
				class="product-badge"
				:style="
					'color:black;' + 'background-color:' + asciiToHexa(slotProps.option)
				"
			>
				{{ slotProps.option }}
			</span>
		</template>
	</Dropdown>
</template>
