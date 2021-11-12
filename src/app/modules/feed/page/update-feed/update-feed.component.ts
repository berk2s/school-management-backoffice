import { Component, OnDestroy, OnInit } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertService } from '@app/alert/alert.service'
import { environment } from '@env'
import { ImagePreview } from '@modules/feed/types'
import { Subject } from 'rxjs'
import {
  pluck,
  tap,
  takeUntil,
  exhaustMap,
  take,
  withLatestFrom,
} from 'rxjs/operators'
import { FeedService } from 'src/app/data/feed/service/feed.service'
import {
  Announcement,
  AnnouncementChannel,
  UpdatingAnnouncement,
} from 'src/app/data/feed/types/feed.types'
import { FeedListComponent } from '../feed-list/feed-list.component'

@Component({
  selector: 'app-update-feed',
  templateUrl: './update-feed.component.html',
  styleUrls: ['./update-feed.component.scss'],
})
export class UpdateFeedComponent implements OnInit, OnDestroy {
  announcement: Announcement = null

  announcementForm: FormGroup
  announcementStatus: AbstractControl

  _unsubscribeAll: Subject<any> = new Subject()

  imgUrl: string

  selectedFiles?: File[] = []
  selectedFileNames: string[] = []
  imagePreviews: ImagePreview[] = []
  deletedImages: string[] = []

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private feedListComponent: FeedListComponent,
    private feedService: FeedService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.imgUrl = `${environment.imageUrls.imageBaseUrl}/`

    this.activatedRoute.data
      .pipe(
        pluck('announcement'),
        takeUntil(this._unsubscribeAll),
        tap(() => this.feedListComponent.matDrawer.open()),
      )
      .subscribe((announcement: Announcement) => {
        if (!announcement) {
          this.router.navigateByUrl('/akis')
        } else {
          this.announcement = announcement

          this.announcementForm = this.formBuilder.group({
            announcementTitle: [
              announcement.announcementTitle,
              Validators.required,
            ],
            announcementDescription: [announcement.announcementDescription],
            announcementChannels: [
              announcement.announcementChannels,
              Validators.required,
            ],
            announcementStatus: [announcement.announcementStatus],
          })

          this.announcementStatus = this.announcementForm.controls[
            'announcementStatus'
          ]
        }
      })
  }

  ngOnDestroy(): void {
    this.feedListComponent.matDrawer.close()

    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }

  setActivate(value: boolean): void {
    this.announcementForm.controls['announcementStatus'].setValue(value)
  }

  update() {
    const updatingAnnouncement: UpdatingAnnouncement = {
      announcementTitle: this.announcementForm.get('announcementTitle').value,
      announcementDescription: this.announcementForm.get(
        'announcementDescription',
      ).value,
      announcementStatus: this.announcementForm.get('announcementStatus').value,
      addedChannels: this.announcementForm.get('announcementChannels').value,
      removedChannels: this.announcement.announcementChannels,
      addedImages: this.selectedFiles,
      deletedImages: this.deletedImages,
    }

    this.announcementForm.disable()

    this.feedService
      .updateAnnouncement(
        this.announcement.announcementId,
        updatingAnnouncement,
      )
      .pipe(
        take(1),
        withLatestFrom(this.feedService.pagination$),
        exhaustMap((data) => {
          const pagination = data[1]
          return this.feedService
            .getAnnouncements(
              pagination.page,
              pagination.size,
              pagination.sortedBy,
              pagination.order,
            )
            .pipe(take(1))
        }),
      )
      .subscribe((data) => {
        this.announcementForm.enable()

        this.alertService.sendMessage({
          alertTitle: 'Başarılı',
          alertContent: 'Duyuru başarılı bir şekilde güncellendi',
          alertType: 'success',
        })
      })
  }

  onImageChange(event: any) {
    const files = event.target.files

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader()

      const file = files[i]

      reader.readAsDataURL(file)

      reader.onload = () => {
        if (
          this.selectedFiles.findIndex(
            (i) => i.lastModified === file.lastModified,
          ) === -1
        ) {
          this.selectedFiles.push(file)
          this.imagePreviews.push({
            id: file.lastModified,
            src: reader.result as string,
            name: file.name,
          })
        }
      }
    }
  }

  deletePreviewImage(id: number) {
    const indexOfSelected = this.selectedFiles.findIndex(
      (i) => i.lastModified === id,
    )
    const indexOfPreview = this.imagePreviews.findIndex((i) => i.id === id)

    if (indexOfSelected !== -1 && indexOfPreview !== -1) {
      this.selectedFiles.splice(indexOfSelected, 1)
      this.imagePreviews.splice(indexOfPreview, 1)
    }
  }

  deleteImage(path: string) {
    if (this.deletedImages.findIndex((p) => p === path) === -1) {
      this.deletedImages.push(path.split('announcements/')[1])
      const i = this.announcement.announcementImages.findIndex(
        (i) => i.imageUrl === path,
      )
      if (i !== -1) {
        this.announcement.announcementImages.splice(i, 1)
      }
    }
  }

  getAnnouncementChannels() {
    const arr = []
    for (const [key, value] of Object.entries(AnnouncementChannel)) {
      arr.push(value)
    }
    return arr
  }

  getAnnouncementChannelKey(s) {
    let transformedChannel

    for (let announcementChannel in AnnouncementChannel) {
      transformedChannel = Object.keys(AnnouncementChannel).find(
        (key) => AnnouncementChannel[key] === s,
      )
    }

    return transformedChannel
  }
}
