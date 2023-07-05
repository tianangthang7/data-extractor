<script setup>
import { ref, onBeforeMount, watch, toRaw } from "vue";
import { asciiToHexa } from "@/utils/utils.js";

const emit = defineEmits(["update:modelValue"]);
var filteredValues = ref([]);

let values = ref([]);
const props = defineProps({
	suggestion: { type: Array, default: [] },
	modelValue: { type: Array, default: [] },
	placeholder: { type: String, default: "Tags" },
});
const modelRef = ref(null);
watch(values, (newValues) => {
	emit("update:modelValue", toRaw(newValues));
});
onBeforeMount(() => {
	if (props.modelValue) {
		values.value = props.modelValue;
	}
});

const searchValues = (event) => {
	if (event.query) {
		let filteredValue = props.suggestion.filter((tag) => {
			return tag.toLowerCase().startsWith(event.query.toLowerCase());
		});
		if (filteredValue.length > 0) {
			filteredValues.value = filteredValue;
		} else {
			filteredValues.value = [event.query];
		}
	}
};

const updateValues = (e) => {
	values.value = [...new Set(e.value)];
};
function showValues() {
	filteredValues.value = props.suggestion;
	if (modelRef.value) {
		modelRef.value.show();
	}
}
const myMethod = (e) => {
	e.target.value += " ";
};
</script>

<template>
	<AutoComplete
		:multiple="true"
		v-model="values"
		:suggestions="filteredValues"
		@complete="searchValues($event)"
		:completeOnFocus="true"
		:placeholder="props.placeholder"
		ref="modelRef"
		@click="showValues"
		@change="updateValues"
		@focus="showValues"
		loadingIcon=""
		v-on:keydown.space.prevent="myMethod"
	>
		<template v-if="!props.optionLabel" #option="option">
			<span
				class="product-badge"
				:style="'color:black;' + 'background-color:' + asciiToHexa(option.option)"
			>
				{{ option.option }}
			</span>
		</template>
	</AutoComplete>
</template>
