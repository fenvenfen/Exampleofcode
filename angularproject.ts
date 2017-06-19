// пример кода profebook.com  notification 

/// <reference path="../app.ts" />

module profebook.home {

    interface INotificationController {
   
    }

    export class MainNotification {
        oneNotification: Notification;
        showValute: boolean;
        notificationIndex: number;
    }

    interface IRootScopeNotification extends ng.IRootScopeService {
        isHideNotification: boolean;
    }

    export class Notification {
        login: string;
        content: string;
        data: string;
        textNotification: string;
        img: string;
        postImg: string[];
    };
    export class NotificationController  {

        notifications: Notification[];

        isHideNotification: boolean;

        MainNotification: MainNotification;

        constructor(private $scope: ng.IScope,
                    private $q: ng.IQService,
                    private $http: ng.IHttpService,
                    private $rootScope: IRootScopeNotification,
                    private $interval: angular.IIntervalService
        ) {
            this.notifications = null;
            this.MainNotification = new MainNotification();
            this.MainNotification.notificationIndex = 0;
            
            this.getNotification().then((value: profebook.home.Notification[]): void => {
                this.notifications = value;
                if (this.notifications.length > 0) {
                    this.MainNotification.showValute = false;
                    this.MainNotification.oneNotification = this.notifications[this.MainNotification.notificationIndex];
                }
                else {
                    this.MainNotification.showValute = true;
                }
                for (var notificationIndex in this.notifications) {
                    let contentPost = this.notifications[notificationIndex].content;
                    if (contentPost.length > 70) {
                        this.notifications[notificationIndex].content = contentPost.slice(0, 70) + '...';
                    }

                    let ImgPost = this.notifications[notificationIndex].postImg;
                    if (ImgPost.length > 3) {
                        this.notifications[notificationIndex].postImg.splice(2, ImgPost.length - 3);
                    }
                }
                
            });
            this.$rootScope.isHideNotification = true;
            this.$interval(() => { this.chanceNotification(); }, 5000);
        }

        chanceNotification() {
            if (!this.MainNotification.showValute) {
                if (this.MainNotification.notificationIndex < this.notifications.length) {
                    this.MainNotification.notificationIndex += 1;
                    if (this.MainNotification.notificationIndex < this.notifications.length) {
                        this.MainNotification.oneNotification = this.notifications[this.MainNotification.notificationIndex];
                    }
                    else {
                        this.MainNotification.notificationIndex = 0;
                        this.MainNotification.showValute = true;
                    }
                }
            }
            else {
                this.MainNotification.showValute = false;
                this.MainNotification.oneNotification = this.notifications[this.MainNotification.notificationIndex];
            }
        }

        loadNodification(): ng.IPromise<Notification[]> {
            var defer = this.$q.defer();

            this.$http
                .get('/notification')
                .success((notifications: Notification[]): void => {
                    console.log(notifications);
                    defer.resolve(notifications);
                })
                .error((): void => {
                    defer.reject();
                });

            return defer.promise;
        }

        getNotification(): ng.IPromise<Notification[]> {
            var defer = this.$q.defer();

            if (this.notifications !== null) {
                // Data is already loaded
                defer.resolve(this.notifications);
            } else {
                this
                    .loadNodification()
                    .then((data: Notification[]): void => {
                        // Resolve loaded account data
                        this.notifications = data;
                        defer.resolve(this.notifications);
                    })
                    .catch((): void => {
                        defer.reject();
                    });
            }

            return defer.promise;
        }
    }

    export class Notifications {
        templateUrl: string;
        restrict: string;
        controller: any;
        controllerAs: string;
        scope: any;
        bindToController: boolean;

        constructor() {
            this.restrict = 'E';
            this.controller = NotificationController;
            this.controllerAs = 'notification';
            this.templateUrl = 'app/home/notification.html';
            this.scope = {
            };
            this.bindToController = true;
          
        }
        public static Factory() {
            return () => {
                return new Notifications();
            };
        }
    }

    profebook.groups.getModule().directive('prNotification', Notifications.Factory());
}