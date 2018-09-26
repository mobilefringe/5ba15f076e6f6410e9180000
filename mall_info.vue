<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="page_header" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>{{ $t("mall_info.info_header") }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="site_container">
                    <div class="program_header_container">
    				    <div class="program_button_container animated_btn">
    				        {{ $t("mall_info.leasing") }}
    				    </div>
    				    <div class="program_button_container animated_btn">
    				        {{ $t("mall_info.marketing") }}
    				    </div>
        				<div class="program_button_container animated_btn" @click="selectContent()" > <!-- v-bind:class="{ selected: item.isActive }" -->
        				    {{ $t("mall_info.area") }}
        				</div>
        			</div>
        			<div class="row">
        			    <div class="col-md-4">
        			        <div class="" v-html=""></div>
        			    </div>
        			   <div class="col-md-8">
        			       <img class="max_width" src="http://placehold.it/1522x1196" alt="" />
        			   </div>
        		    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex"], function(Vue, Vuex) {
        return Vue.component("mall-info-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    leasingContent: null,
                    marketingContent: null,
                    areaContent: null
                }
            },
            created(){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Mall Info Banner');
                    if (temp_repo) {
                        try {
                            this.pageBanner = temp_repo.images[0];
                        } catch(e) {
                            
                        }
                    } else {
                        this.pageBanner = { "image_url": "https://via.placeholder.com/1920x300" }
                    }
                    console.log(response)
                    this.leasingContent = response[1];
                    this.marketingContent = response[2];
                    this.areaContent = response[3];
                    this.pages
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName'
                ]),
                pages() {
                    var pages_json = [];
                    pages_json = _.concat(pages_json, this.leasingContent, this.marketingContent, this.areaContent)
                    console.log(pages_json)
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/southland-leasing.json"}), this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/southland-marketing-partners.json"}), this.$store.dispatch('LOAD_PAGE_DATA', {url: this.property.mm_host + "/pages/southland-area-info.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                selectContent(item) {
                    this.show = !this.show
                    _.forEach(this.gallery1, function (value, key) {
                      value.isActive = false;
                    });
                    
                    var selected_item = item
                    this.$nextTick(function () {
                      selected_item.isActive = true;
                    });
            
                    this.groundFloor = selected_item;
                }
            }
        });
    });
</script>
