<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useLayout } from "@/layout/composables/layout";
import { useRouter } from "vue-router";
import { userService } from "@/service/UserService";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const { layoutConfig, onMenuToggle, contextPath, changeThemeSettings } = useLayout();

const topbarMenuActive = ref(false);
const router = useRouter();
const isDarkMode = ref(false);
const menu = ref(null);
const userInfo = ref({
	id: "",
	name: "",
	picture: {
		data: {
			url: "",
		},
	},
});

let themeIndex = 0;
const themes = [
	"lara-dark-indigo",
	"lara-light-blue",
	"lara-dark-blue",
	"lara-light-teal",
	"lara-dark-teal",
	"lara-light-purple",
	"lara-dark-purple",
	"lara-light-indigo",
];

onBeforeMount(async () => {});

const logoUrl = computed(() => {
	return `${contextPath}layout/images/${
		layoutConfig.darkTheme.value ? "logo" : "logo"
	}.png`;
});

const openProfile = () => {
	router.push("/users");
};
const topbarMenuClasses = computed(() => {
	return {
		"layout-topbar-menu-mobile-active": topbarMenuActive.value,
	};
});

const onChangeTheme = (theme) => {
	themeIndex = (themeIndex += 1) % themes.length;
	if (!theme) {
		theme = themes[themeIndex];
	}
	isDarkMode.value = theme.includes("dark") ? "dark" : "light";
	const elementId = "theme-css";
	const linkElement = document.getElementById(elementId);
	const cloneLinkElement = linkElement.cloneNode(true);
	const newThemeUrl = linkElement
		.getAttribute("href")
		.replace(layoutConfig.theme.value, theme);
	cloneLinkElement.setAttribute("id", elementId + "-clone");
	cloneLinkElement.setAttribute("href", newThemeUrl);
	cloneLinkElement.addEventListener("load", () => {
		linkElement.remove();
		cloneLinkElement.setAttribute("id", elementId);
		changeThemeSettings(theme, isDarkMode.value);
	});
	linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
};

const toggle = (event) => {
	menu.value.show(event);
};

const logout = (event) => {
	userService.logout();
	router.push("/login");
};
const items = ref([
	{
		label: "Thông tin",
		icon: "pi pi-fw pi-user",
		command: openProfile,
	},
	{ label: "Đại lý", icon: "pi pi-fw  pi-money-bill" },
	{ label: "Đăng xuất", icon: "pi pi-fw  pi-sign-out", command: logout },
]);
</script>

<template>
	<Toast position="bottom-right" />
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<img :src="logoUrl" alt="logo" />
			<span>MyAssistant.vn</span>
		</router-link>

		<button
			class="p-link layout-topbar-menu-button layout-topbar-button"
			@click="onTopBarMenuButton()"
		>
			<i class="pi pi-ellipsis-v"></i>
		</button>

		<div class="layout-topbar-menu" :class="topbarMenuClasses">
			<Button
				:icon="isDarkMode == 'dark' ? 'pi pi-sun' : 'pi pi-moon'"
				class="p-button-text p-component"
				@click="onChangeTheme()"
				rounded
			></Button>
			<Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
