import { Component, OnDestroy, OnInit } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'
import { AlertService } from '@app/alert/alert.service'
import { ImagePreview } from '@modules/feed/types'
import { exhaustMap, take, withLatestFrom } from 'rxjs/operators'
import { FeedService } from 'src/app/data/feed/service/feed.service'
import {
  AnnouncementChannel,
  CreatingAnnouncement,
} from 'src/app/data/feed/types/feed.types'
import { FeedListComponent } from '../feed-list/feed-list.component'

@Component({
  selector: 'app-create-feed',
  templateUrl: './create-feed.component.html',
  styleUrls: ['./create-feed.component.scss'],
})
export class CreateFeedComponent implements OnInit, OnDestroy {
  feedForm: FormGroup
  announcementStatus: AbstractControl

  selectedFiles?: File[] = []
  imagePreviews: ImagePreview[] = []

  constructor(
    private formBuilder: FormBuilder,
    private feedListComponent: FeedListComponent,
    private alertService: AlertService,
    private feedService: FeedService,
  ) {}

  ngOnInit(): void {
    this.feedListComponent.matDrawer.open()

    this.feedForm = this.formBuilder.group({
      announcementTitle: ['', Validators.required],
      announcementDescription: [''],
      announcementChannels: [[], Validators.required],
      announcementStatus: [true],
    })

    this.announcementStatus = this.feedForm.controls['announcementStatus']
  }

  ngOnDestroy(): void {
    this.feedListComponent.matDrawer.close()
  }

  setActivate(value: boolean): void {
    this.feedForm.controls['announcementStatus'].setValue(value)
  }

  save(): void {
    const announcementChannelArr = []

    for (let announcementChannel of this.feedForm.get('announcementChannels')
      .value) {
      const transformedChannel = Object.keys(AnnouncementChannel).find(
        (key) => AnnouncementChannel[key] === announcementChannel,
      )

      if (transformedChannel) {
        announcementChannelArr.push(transformedChannel)
      }
    }

    const creatingAnnouncement: CreatingAnnouncement = {
      ...this.feedForm.value,
      announcementChannels: announcementChannelArr,
      images: this.selectedFiles,
    }

    this.feedForm.disable()

    this.feedService
      .saveAnnouncement(creatingAnnouncement)
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
        this.feedForm.reset()
        this.feedForm.enable()
        this.announcementStatus.setValue(true)
        this.selectedFiles = []
        this.imagePreviews = []

        this.alertService.sendMessage({
          alertTitle: 'Başarılı',
          alertContent: 'Duyuru başarılı bir şekilde oluşturuldu',
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

  getAnnouncementChannels() {
    const arr = []
    for (const [key, value] of Object.entries(AnnouncementChannel)) {
      arr.push(value)
    }
    return arr
  }
}
