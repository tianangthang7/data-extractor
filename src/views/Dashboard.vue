<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { userService } from "@/service/UserService";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const isValid = ref(true);
const info = ref({});
const numfilesProcessed = ref(0);
const destination = ref("D:\\");
const mode = ref("muiltipleFiles");
const files = ref([]);

const start = async () => {
	if (files.value.length == 0) {
		toast.add({
			severity: "error",
			summary: "Error Message",
			detail: "Chưa chọn files",
			life: 3000,
		});

		return;
	}
	if (!destination.value) {
		toast.add({
			severity: "error",
			summary: "Error Message",
			detail: "Chưa có thư mục ghi kết quả",
			life: 3000,
		});

		return;
	}

	console.log(files.value);
	for (let i = 0; i < files.value.length; i++) {
		numfilesProcessed.value = i + 1;
		let data = await window.myAPI.importData(
			files.value[i],
			destination.value,
			mode.value
		);
	}
};

watch(mode, (newMode) => {
	if (newMode == "singleFile") {
		destination.value += "\\output.txt";
	} else {
		destination.value = destination.value.replaceAll("\\output.txt", "");
	}
});
const openFiles = async () => {
	isValid.value = true;
	let filePaths = await window.myAPI.openFiles();
	files.value = filePaths;
};
const openFolder = async () => {
	isValid.value = true;
	let filePaths = await window.myAPI.openFolder();
	files.value = filePaths;
};

const selectDestination = async () => {
	window.myAPI.selectFolder().then((result) => {
		destination.value = result;
	});
};
</script>

<template>
	<div class="grid">
		<div class="flex flex-wrap gap-3 mt-4">
			<Button
				icon="pi pi-file"
				severity="help"
				class="p-button-outlined p-button-info gap-2"
				@click="openFiles"
				v-tooltip="'Chọn người nhận từ files'"
				label="Nhập từ files"
			/>
			<Button
				icon="pi pi-folder"
				severity="help"
				class="p-button-outlined p-button-info"
				@click="openFolder"
				v-tooltip="'Quét data trong thư mục'"
				label="Chọn thư mục"
			/>
		</div>
	</div>
	<div class="grid mt-4">
		<div class="flex flex-column gap-2">
			<p v-if="files">Đã chọn {{ files.length }} file(s)</p>
		</div>
	</div>

	<div class="grid mt-4">
		<div class="flex flex-column gap-2">
			<Button
				icon="pi pi-folder"
				severity="help"
				class="p-button-outlined p-button-info"
				@click="selectDestination"
				label="Chọn thư mục ghi kết quả"
			/>
			<div class="flex flex-wrap gap-3 mt-4">
				<div class="flex align-items-center">
					<RadioButton
						v-model="mode"
						inputId="ingredient1"
						name="pizza"
						value="muiltipleFiles"
					/>
					<label for="ingredient1" class="ml-2"
						>Ghi kết quả vào từng file</label
					>
				</div>
				<div class="flex align-items-center">
					<RadioButton
						v-model="mode"
						inputId="ingredient2"
						name="pizza"
						value="singleFile"
					/>
					<label for="ingredient2" class="ml-2">Ghi chung vào một file</label>
				</div>
			</div>
			<Textarea v-model="destination" autoResize rows="1" cols="60" class="mt-4" />
			<Button
				severity="help"
				class="p-button-info mt-4"
				@click="start"
				label="Bắt đầu"
			/>
		</div>
	</div>
	<div class="grid mt-4">
		<div class="flex flex-column gap-2">
			<p v-if="files">
				Đang xử lý {{ numfilesProcessed }}/{{ files.length }}
				file(s)
			</p>
		</div>
	</div>
</template>
