# frozen_string_literal: true

module Projects
  module HashedStorage
    class RollbackAttachmentsService < BaseAttachmentService
      def initialize(project, logger: nil)
        @project = project
        @logger = logger || Rails.logger
        @old_disk_path = project.disk_path
      end

      def execute
        origin = FileUploader.absolute_base_dir(project)
        project.storage_version = ::Project::HASHED_STORAGE_FEATURES[:repository]
        target = FileUploader.absolute_base_dir(project)

        @new_disk_path = FileUploader.base_dir(project)

        result = move_folder!(origin, target)

        if result
          project.save!

          yield if block_given?
        else
          # Rollback changes
          project.rollback!
        end

        result
      end
    end
  end
end
