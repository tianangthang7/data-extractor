<script setup>
import { useToast } from "primevue/usetoast";
import { ref, onBeforeMount, toRaw, watch } from "vue";

import * as XLSX from "xlsx";
const toast = useToast();

const fileName = ref(null);
const sheetNames = ref([]);
const parsedData = ref([]);
const selectedSheets = ref([]);
const message = ref("");
const addMedia = async (event) => {
	const files = event.files;
	console.log(files);

	const file = files[0];
	fileName.value = file.name;
	// Create a new file reader
	const reader = new FileReader();

	// Add an event listener to the file reader
	reader.addEventListener("load", function (event) {
		// Parse the XLSX data using SheetJS
		const data = event.target.result;
		const workbook = XLSX.read(data, { type: "binary" });
		sheetNames.value = workbook.SheetNames;
		selectedSheets.value = [];
		const sheets = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheets];
		const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

		// Do something with the parsed data
		console.log(parsedData);
	});
	// Read the selected file as a binary string
	reader.readAsBinaryString(file);
};
</script>

<template>
	<div class="card p-fluid">
		<Textarea
			v-model="message"
			placeholder="Nhập tin nhắn"
			autoResize
			rows="5"
			cols="30"
			class="mt-4"
		/>
		<FileUpload
			mode="basic"
			chooseLabel="Chọn file"
			:auto="true"
			accept=".csv,.xls,.xlsx"
			:multiple="false"
			url="./upload.php"
			@upload="addMedia"
			class="mt-4"
		/>

		<h2 v-if="fileName">
			<i class="pi pi-file-excel" style="color: green; font-size: 2.5rem"></i>
			{{ fileName }}
		</h2>
		<MultiSelect
			v-if="sheetNames.length > 0"
			v-model="selectedSheets"
			display="chip"
			:options="sheetNames"
			placeholder="Chọn Sheet"
			:maxSelectedLabels="3"
			class="w-full"
		/>
	</div>
</template>
