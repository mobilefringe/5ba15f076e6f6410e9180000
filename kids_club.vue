<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="page_header" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>{{ $t("programs_page.programs_header") }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="site_container">
                    <div class="program_header_container">
        				<div class="stores_button_container">
        					
        				</div>
        				<div class="stores_button_container">
        				    
        				</div>
        			</div>
        			<div class="row">
        			    <div class="col-md-12">
        			        <h4 v-html=""></h4>
        			    </div>
        			</div>
        			
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex"], function(Vue, Vuex) {
        return Vue.component("kids-club-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    pageHeader: null,
                    pageBody: null,
                    pageImage: null
                }
            },
            created(){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Kids Club Banner');
                    if (temp_repo) {
                        try {
                            this.pageBanner = temp_repo.images[0];
                        } catch(e) {
                            
                        }
                    } else {
                        this.pageBanner = { "image_url": "https://via.placeholder.com/1920x300" }
                    }
                    
                    if (response[1]) {
                        try {
                            this.currentpage
                        }
                    }
                    console.log(response)
                   this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName'
                ]),

            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/southland-kids-club.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
            }
        });
    });
</script>
