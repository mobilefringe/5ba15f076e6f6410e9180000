<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
        		<div class="page_header hidden_phone" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>{{ $t("jobs_page.jobs") }}</h1>
        				</div>
        			</div>
        		</div>
        		<div class="site_container">
				    <div class="promo_container jobs clearfix" v-for="(promo, index) in promotions">
					    <div class="promo_img" v-lazy:background-image="promo.image_url"></div>
					    <div class="promo_content">
					        <h2>{{ promo.store_name }}</h2>
					        <h4 v-if="promo.store_category" class="bold">{{ promo.store_category }}</h4>
							<hr>
					        <p class="job_position" v-if="locale=='en-ca'">{{ $t("jobs_page.position") }}: {{ promo.name }}</p>
					        <p class="job_position" v-else>{{ $t("jobs_page.position") }}: {{ promo.name_2 }}</p>
					        <p class="job_position" v-if="promo.job_type">{{ $t("jobs_page.job_type") }}:  {{ checkJobType(promo) }}</p>
							<p class="job_date">{{ $t("jobs_page.end_date") }}: {{promo.end_date | moment("MMMM DD, YYYY", timezone)}}</p>
							<router-link :to="'/jobs/'+ promo.slug" >
							   <div class="promo_learn_more animated_btn">{{ $t("jobs_page.read_more") }}</div>
						    </router-link>
					    </div>
					</div>
        			<div class="row no_promos" v-else>
        				<div class="col-md-12">
        					<p>{{$t("jobs_page.no_job_message")}}</p>
        				</div>
        			</div>
        		</div>
		    </div>
		</transition>
	</div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-lazy-load"], function(Vue, Vuex, moment, tz, VueMoment, VueLazyload) {
        Vue.use(VueLazyload);
        return Vue.component("promos-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    paginate: ['promos'],
                    promos : null
                }
            },
            created() {
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Jobs Banner');
                    if(temp_repo) {
                        try {
                            this.pageBanner = temp_repo.images[0];
                        } catch(e) {
                            
                        }
                    } else {
                        this.pageBanner = { "image_url": "https://via.placeholder.com/1920x300" }
                    }
                    this.promos = this.promotions;
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName',
                    'processedJobs',
                    'findCategoryById'
                ]),
                promotions() {
                    var property_name = this.property.name
                    var vm = this;
                    var temp_promo = [];
                    var temp_job = [];
                    // console.log(this.processedJobs)
                    _.forEach(this.processedJobs, function(value, key) {
                        if (value.store != null && value.store != undefined) {
                            if(_.includes(value.store.image_url, 'missing')) {
                                value.image_url = "https://via.placeholder.com/400x400/757575";
                            } else {
                                value.image_url = value.store.store_front_url_abs;  
                            }
                            value.store_name = value.store.name;
                            
                            if (value.store.categories.length > 0) {
                                value.store_category = vm.getStoreCategories(value.store.categories);
                            }
                        } else if (value.store == null || value.store == undefined) {
                            value.store = {};
                            value.image_url =  "https://via.placeholder.com/400x400/757575";
                            value.store_name = property_name;
                        }
                        
                        temp_promo.push(value);
                    });
                    _.sortBy(temp_promo, [function(o) { return o.start_date; }]);
                    return temp_promo;
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos"), this.$store.dispatch("getData", "jobs"), this.$store.dispatch("getData", "categories")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                getStoreCategories(store_categories) {
                    var store_categories = store_categories;
                    var vm = this;
                    var categories = [];
                    _.forEach(store_categories, function(value, key) {
                        try {
                            var category = vm.findCategoryById(value);
                            var category_name = category.name
                            categories.push(category_name)
                        } catch(e) {
                            
                        }
                    });
                    
                    categories = _.toString(categories, ', ');
                    console.log(categories)
                    return categories
                },
                checkJobType(promo) {
                    if(this.locale != "en-ca") {
                        if(promo.job_type == "Full Time"){
                            return "Plein Temps"
                        } else if (promo.job_type == "Part Time"){
                            return "Mi Temps"
                        } else if (promo.job_type == "Full Time/Part Time"){
                            return "Plein/Mi Temps"
                        } else if (promo.job_type == "Seasonal"){
                            return "Travail Saisonnier"
                        }
                    } else {
                        return promo.job_type
                    }
                }
            }
        });
    });
</script>