<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { useLayout } from "@/layout/composables/layout";
import { userService } from "@/service/UserService";
const isValid = ref(true);

const selectFiles = async () => {
	isValid.value = true;
	let files = await window.fileUtils.openFiles();
	let tmp = [...files];
	info.value.files = tmp.map((file) => {
		return { name: file.name, path: file.path };
	});
	console.log(files);
};
const selectFolder = async () => {
	isValid.value = true;
	let files = await window.fileUtils.openFolder();
	let tmp = [...files];
	info.value.files = tmp.map((file) => {
		return { name: file.name, path: file.path };
	});
	console.log(files);
};
</script>

<template>
	<div class="grid">
		<div class="mt-4 flex gap-3">
			<Button
				icon="pi pi-file"
				severity="help"
				class="p-button-outlined p-button-info gap-2"
				@click="selectFiles"
				v-tooltip="'Chọn người nhận từ files'"
				label="Nhập từ files"
			/>
			<Button
				icon="pi pi-folder"
				severity="help"
				class="p-button-outlined p-button-info"
				@click="selectFolder"
				v-tooltip="'Quét data trong thư mục'"
				label="Chọn thư mục"
			/>
		</div>
	</div>
</template>
