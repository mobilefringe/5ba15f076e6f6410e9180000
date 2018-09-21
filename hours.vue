<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loader v-if="!dataLoaded"></loader>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="page_header" v-if="pageBanner" v-bind:style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
        			<div class="site_container">
        				<div class="header_content caps">
        					<h1>{{$t("hours_page.hours")}}</h1>
        				</div>
        			</div>
        		</div>  
                <div class="site_container">
                    <div class="all_hours_container">
                        <div class="row">
                            <div class="col-md-12">
                                <h4>Exterior retailer's hours may differ from The {{property.name}}'s regular shopping hours.</h4>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6">
                                <h5 class="caps">{{ $t("hours_page.reg_hours") }}</h5>
                                <div id="hours_container" class="hours_container">
                                    <div class="hours_div text-left" v-for="hour in hours">
                                        <span :class="hour.todays_hour">
                                            <span>{{ hour.day_of_week | moment("dddd", timezone) }}: </span>
                                            <span v-if="hour.is_closed == true">Closed</span>
                                            <span v-else>
                                                {{hour.open_time | moment("h:mm A", timezone)}} - {{hour.close_time | moment("h:mm A", timezone)}}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12">
                                <h4 class="caps">Holiday Hours</h4>
                            </div>
                            <div v-for="hour in holidayHours" class="col-sm-6">
                                <div class="row">
                                    <div class="col-md-4">
                                        <p>{{ hour.holiday_name }}</p>
                                    </div>
                                    <div class="col-md-4">
                                        <p>{{ hour.holiday_date | moment("MMM D YYYY", timezone) }}</p>    
                                    </div>
                                    <div class="col-md-4">
                                        <span v-if="hour.is_closed == true">{{ $t("hours_page.closed") }}</span>
                                        <span v-else>
                                            {{ hour.open_time | moment("h:mm A", timezone)}} - {{hour.close_time | moment("h:mm A", timezone) }}
                                        </span>    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div>    
        </transition>        
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-meta"], function(Vue, Vuex, moment, tz, VueMoment, Meta) {
        Vue.use(Meta);
        return Vue.component("hours-component", {
            template: template, // the variable template will be injected
            props:['locale'],
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner : null
                }
            },
            created() {
                this.loadData().then(response => {
                    this.dataLoaded = true;
                    
                    var temp_repo = this.findRepoByName('Hours Banner');
                    if(temp_repo) {
                        this.pageBanner = temp_repo.images[0];
                    }
                });
            },
            watch : {
                locale: function(val, oldVal) {
                    console.log("locale", this.locale);
                },
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'getPropertyHours',
                    'getPropertyHolidayHours',
                    'findRepoByName'
                ]),
                hours () {
                    var today = moment().day()
                    var hours = this.getPropertyHours;
                    _.forEach(hours, function(value) {
                        if( today == value.day_of_week ){
                            value.todays_hour = "todays_hour"
                        }    
                    });
                    return hours;
                },
                holidayHours () {
                    return this.getPropertyHolidayHours;
                }
            },
            methods : {
                loadData: async function() {
                    try {
                        // avoid making LOAD_META_DATA call for now as it will cause the entire Promise.all to fail since no meta data is set up.
                        let results = await Promise.all([this.$store.dispatch("getData", "repos")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
            }
        });
    });
</script>
